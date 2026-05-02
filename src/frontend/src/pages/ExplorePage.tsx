import { createActor } from "@/backend";
import type { Profile } from "@/backend";
import { AvatarImage } from "@/components/AvatarImage";
import { FollowButton } from "@/components/FollowButton";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Post, User, UserId } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Compass, RefreshCw, Search, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

// ─── Skeletons ────────────────────────────────────────────────────────────────

function PostGridSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="feed-card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
          <Skeleton className="h-52 w-full rounded-lg" />
          <div className="flex gap-4">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-7 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

function UserCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-36 bg-card border border-border rounded-xl p-3 space-y-2">
      <Skeleton className="w-12 h-12 rounded-full mx-auto" />
      <Skeleton className="h-3 w-20 mx-auto" />
      <Skeleton className="h-2.5 w-14 mx-auto" />
      <Skeleton className="h-7 w-full rounded-md" />
    </div>
  );
}

// ─── Suggested User Card ──────────────────────────────────────────────────────

interface SuggestedUserCardProps {
  user: User;
  index: number;
}

function SuggestedUserCard({ user, index }: SuggestedUserCardProps) {
  const navigate = useNavigate();

  return (
    <div
      data-ocid={`explore.suggested_user.${index}`}
      className="flex-shrink-0 w-36 bg-card border border-border rounded-xl p-3 flex flex-col items-center gap-2 transition-smooth hover:shadow-sm"
    >
      <button
        type="button"
        className="flex flex-col items-center gap-1.5 w-full group"
        onClick={() => navigate({ to: `/profile/${user.username}` })}
        aria-label={`View ${user.displayName}'s profile`}
      >
        <AvatarImage
          blob={user.avatarBlob}
          displayName={user.displayName}
          username={user.username}
          size="md"
        />
        <p className="font-semibold text-xs text-foreground truncate w-full text-center leading-tight group-hover:text-primary transition-colors">
          {user.displayName}
        </p>
        <p className="text-xs text-muted-foreground truncate w-full text-center">
          {Number(user.followerCount).toLocaleString()} followers
        </p>
      </button>
      <FollowButton
        targetPrincipal={user.principal}
        targetUsername={user.username}
        size="sm"
        className="w-full"
      />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12n;

export default function ExplorePage() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  // Extra pages loaded via "Load More" (beyond the first page from RQ cache)
  const [extraPosts, setExtraPosts] = useState<Post[]>([]);
  const [nextOffset, setNextOffset] = useState<bigint | null>(null);

  // ── Trending posts (first page) ─────────────────────────────────────────────
  const {
    data: trendingPage,
    isLoading: postsLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["explore", "trending"],
    queryFn: async () => {
      if (!actor)
        return {
          items: [] as Post[],
          total: 0n,
          nextOffset: undefined as bigint | undefined,
        };
      const page = await actor.getExploreFeed(0n, PAGE_SIZE);
      return page;
    },
    enabled: !!actor && !isFetching,
  });

  const firstPagePosts = trendingPage?.items ?? [];
  const firstPageNextOffset = trendingPage?.nextOffset;
  // nextOffset state is set after first Load More click; use RQ data until then
  const currentOffset =
    nextOffset ??
    (firstPageNextOffset !== undefined && firstPageNextOffset !== null
      ? firstPageNextOffset
      : BigInt(firstPagePosts.length));
  const hasMore =
    nextOffset !== null
      ? true // we already have a next offset from last load-more
      : firstPageNextOffset !== undefined && firstPageNextOffset !== null;
  const displayPosts = [...firstPagePosts, ...extraPosts];

  // ── Suggested users — derived from explore feed authors ────────────────────
  const { data: suggestedProfiles, isLoading: usersLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      if (!actor) return [] as User[];
      const page = await actor.getExploreFeed(0n, 20n);
      // Deduplicate by authorPrincipal and fetch profiles for first 10 unique authors
      const seen = new Set<string>();
      const uniquePrincipals: UserId[] = [];
      for (const post of page.items) {
        const key = post.authorPrincipal.toString();
        if (!seen.has(key)) {
          seen.add(key);
          uniquePrincipals.push(post.authorPrincipal);
          if (uniquePrincipals.length >= 10) break;
        }
      }
      const profiles = await Promise.all(
        uniquePrincipals.map((p) => actor.getUserProfile(p)),
      );
      return profiles
        .filter((p): p is Profile => p !== null)
        .map(
          (p) =>
            ({
              principal: p.principal,
              username: p.username,
              displayName: p.displayName,
              bio: p.bio,
              avatarBlob: p.avatarBlob,
              followerCount: p.followerCount,
              followingCount: p.followingCount,
              postCount: p.postCount,
              createdAt: p.createdAt,
            }) as User,
        );
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  const suggestedUsers = suggestedProfiles ?? [];

  // ── Load more ───────────────────────────────────────────────────────────────
  const loadMoreMutation = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      const page = await actor.getExploreFeed(currentOffset, PAGE_SIZE);
      setExtraPosts((prev) => [...prev, ...page.items]);
      const newNext =
        page.nextOffset !== undefined && page.nextOffset !== null
          ? page.nextOffset
          : null;
      setNextOffset(newNext);
    },
  });

  // ── Refresh ─────────────────────────────────────────────────────────────────
  const handleRefresh = () => {
    setExtraPosts([]);
    setNextOffset(null);
    queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
    refetch();
  };

  return (
    <div
      data-ocid="explore.page"
      className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6 space-y-8"
    >
      {/* ── Search bar ── */}
      <div data-ocid="explore.search_bar" className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          data-ocid="explore.search_input"
          type="search"
          placeholder="Search posts, people, topics…"
          className="pl-10 h-11 bg-card border-border text-sm placeholder:text-muted-foreground focus-visible:ring-primary/40"
          readOnly
          aria-label="Search (coming soon)"
        />
      </div>

      {/* ── Suggested Users ── */}
      <section
        data-ocid="explore.suggested_users.section"
        aria-labelledby="suggested-heading"
      >
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-primary" />
          <h2
            id="suggested-heading"
            className="font-display font-semibold text-base text-foreground"
          >
            Suggested for you
          </h2>
        </div>

        {usersLoading ? (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
            {[1, 2, 3, 4].map((i) => (
              <UserCardSkeleton key={i} />
            ))}
          </div>
        ) : suggestedUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">
            No suggestions right now. Explore some posts and come back!
          </p>
        ) : (
          <ul
            data-ocid="explore.suggested_users.list"
            className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none list-none m-0 p-0"
            aria-label="Suggested users"
          >
            {suggestedUsers.map((user, i) => (
              <li key={user.principal.toString()} className="contents">
                <SuggestedUserCard user={user} index={i + 1} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Trending Posts ── */}
      <section
        data-ocid="explore.trending_posts.section"
        aria-labelledby="trending-heading"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2
              id="trending-heading"
              className="font-display font-semibold text-base text-foreground"
            >
              Trending Posts
            </h2>
          </div>
          <Button
            data-ocid="explore.refresh_button"
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={postsLoading || isRefetching}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
            aria-label="Refresh trending posts"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`}
            />
            <span className="text-xs">Refresh</span>
          </Button>
        </div>

        {postsLoading ? (
          <PostGridSkeleton />
        ) : displayPosts.length === 0 ? (
          <div
            data-ocid="explore.empty_state"
            className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-xl"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Compass className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">
              Nothing trending yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Be the first to share something — your post could be the one that
              starts the conversation.
            </p>
          </div>
        ) : (
          <>
            <div data-ocid="explore.posts_list">
              {displayPosts.map((post, i) => (
                <PostCard key={post.id.toString()} post={post} index={i + 1} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center pt-2">
                <Button
                  data-ocid="explore.load_more_button"
                  variant="outline"
                  size="default"
                  onClick={() => loadMoreMutation.mutate()}
                  disabled={loadMoreMutation.isPending}
                  className="w-full max-w-xs"
                >
                  {loadMoreMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Loading…
                    </>
                  ) : (
                    "Load more"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
