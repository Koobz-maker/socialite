import { createActor } from "@/backend";
import type { Profile } from "@/backend";
import { AvatarImage } from "@/components/AvatarImage";
import { FollowButton } from "@/components/FollowButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import type { Post } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Grid3X3, ImageOff, MessageCircle, UserX, Users } from "lucide-react";

// ─── Post Thumbnail ──────────────────────────────────────────────────────────

const THUMB_COLORS = [
  "bg-primary/20",
  "bg-accent/20",
  "bg-secondary",
  "bg-muted",
  "bg-primary/10",
  "bg-accent/10",
];

function PostThumbnail({
  post,
  index,
}: {
  post: Post;
  index: number;
}) {
  const navigate = useNavigate();
  const colorClass = THUMB_COLORS[index % THUMB_COLORS.length];

  return (
    <button
      type="button"
      data-ocid={`profile.post_thumb.${index + 1}`}
      className="aspect-square w-full overflow-hidden rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none group relative"
      onClick={() => navigate({ to: `/post/${post.id}` })}
      aria-label={`View post: ${post.caption.slice(0, 40)}`}
    >
      {post.photoBlob ? (
        <img
          src={post.photoBlob.getDirectURL()}
          alt={post.caption || "Post photo"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center p-2 ${colorClass}`}
        >
          <p className="text-xs text-foreground/80 text-center line-clamp-4 leading-relaxed font-body">
            {post.caption}
          </p>
        </div>
      )}
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-200" />
    </button>
  );
}

// ─── User List Item ───────────────────────────────────────────────────────────

function UserListItem({
  principal,
  index,
  showChat,
}: {
  principal: string;
  index: number;
  showChat?: boolean;
}) {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const { isAuthenticated, principal: myPrincipal } = useAuth();

  const { data: profile } = useQuery<Profile | null>({
    queryKey: ["profile", principal],
    queryFn: async () => {
      if (!actor) return null;
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.getUserProfile(Principal.fromText(principal));
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  const isOwnProfile = myPrincipal === principal;

  return (
    <div
      data-ocid={`profile.follower_item.${index + 1}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
    >
      <button
        type="button"
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
        onClick={() =>
          profile && navigate({ to: `/profile/${profile.username}` })
        }
        aria-label={`View ${profile?.displayName ?? "user"}'s profile`}
      >
        {profile ? (
          <AvatarImage
            blob={profile.avatarBlob}
            displayName={profile.displayName}
            username={profile.username}
            size="sm"
          />
        ) : (
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
        )}
        <div className="min-w-0">
          {profile ? (
            <>
              <p className="text-sm font-semibold text-foreground truncate leading-tight">
                {profile.displayName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                @{profile.username}
              </p>
            </>
          ) : (
            <div className="space-y-1">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          )}
        </div>
      </button>
      {profile &&
        !isOwnProfile &&
        isAuthenticated &&
        (showChat ? (
          <Button
            data-ocid={`profile.chat_button.${index + 1}`}
            size="icon"
            variant="ghost"
            className="flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-primary"
            aria-label={`Message ${profile.displayName}`}
            onClick={() => navigate({ to: `/chat/${profile.username}` })}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        ) : (
          <FollowButton
            targetPrincipal={profile.principal}
            targetUsername={profile.username}
            size="sm"
          />
        ))}
    </div>
  );
}

// ─── Profile Header Skeleton ──────────────────────────────────────────────────

function ProfileHeaderSkeleton() {
  return (
    <div
      data-ocid="profile.loading_state"
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <div className="flex gap-6 mb-8">
        <Skeleton className="w-24 h-24 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3 pt-1">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-full max-w-xs" />
          <div className="flex gap-5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {["a", "b", "c", "d", "e", "f", "g", "h", "i"].map((k) => (
          <Skeleton key={k} className="aspect-square w-full rounded-sm" />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { username } = useParams({ from: "/profile/$username" });
  const { actor, isFetching } = useActor(createActor);
  const { isAuthenticated, principal: myPrincipal } = useAuth();
  const navigate = useNavigate();

  // Resolve profile by scanning explore feed for a matching username.
  const { data: profile, isLoading: profileLoading } = useQuery<Profile | null>(
    {
      queryKey: ["profileByUsername", username],
      queryFn: async () => {
        if (!actor) return null;
        const page = await actor.getExploreFeed(0n, 500n);
        const seen = new Set<string>();
        const uniquePrincipals: (typeof page.items)[0]["authorPrincipal"][] =
          [];
        for (const post of page.items) {
          const key = post.authorPrincipal.toString();
          if (!seen.has(key)) {
            seen.add(key);
            uniquePrincipals.push(post.authorPrincipal);
          }
        }
        const BATCH = 20;
        for (let i = 0; i < uniquePrincipals.length; i += BATCH) {
          const batch = uniquePrincipals.slice(i, i + BATCH);
          const profiles = await Promise.all(
            batch.map((p) => actor.getUserProfile(p)),
          );
          const match = profiles.find((p) => p?.username === username);
          if (match) return match;
        }
        return null;
      },
      enabled: !!actor && !isFetching,
      staleTime: 30_000,
    },
  );

  const isOwnProfile =
    isAuthenticated &&
    myPrincipal !== null &&
    profile?.principal.toString() === myPrincipal;

  // Posts
  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["userPosts", profile?.principal?.toString()],
    queryFn: async () => {
      if (!actor || !profile) return [];
      const page = await actor.listPostsByAuthor(profile.principal, 0n, 60n);
      return page.items;
    },
    enabled: !!actor && !isFetching && !!profile,
    staleTime: 30_000,
  });

  // Followers
  const { data: followerPrincipals } = useQuery<string[]>({
    queryKey: ["followers", profile?.principal?.toString()],
    queryFn: async () => {
      if (!actor || !profile) return [];
      const page = await actor.getFollowers(profile.principal, 0n, 50n);
      return page.items.map((p) => p.toString());
    },
    enabled: !!actor && !isFetching && !!profile,
    staleTime: 30_000,
  });

  // Following
  const { data: followingPrincipals } = useQuery<string[]>({
    queryKey: ["following", profile?.principal?.toString()],
    queryFn: async () => {
      if (!actor || !profile) return [];
      const page = await actor.getFollowing(profile.principal, 0n, 50n);
      return page.items.map((p) => p.toString());
    },
    enabled: !!actor && !isFetching && !!profile,
    staleTime: 30_000,
  });

  if (profileLoading) return <ProfileHeaderSkeleton />;

  if (!profile) {
    return (
      <div
        data-ocid="profile.not_found"
        className="max-w-2xl mx-auto px-4 py-20 text-center"
      >
        <UserX className="h-14 w-14 text-muted-foreground mx-auto mb-4" />
        <h2 className="font-display text-xl font-semibold text-foreground mb-2">
          User not found
        </h2>
        <p className="text-sm text-muted-foreground">
          @{username} doesn't exist or hasn't appeared in the public feed yet.
        </p>
      </div>
    );
  }

  const followerList = followerPrincipals ?? [];
  const followingList = followingPrincipals ?? [];

  return (
    <div data-ocid="profile.page" className="max-w-2xl mx-auto pb-24 md:pb-6">
      {/* ── Profile Header ── */}
      <div className="px-4 pt-6 pb-5">
        <div className="flex items-start gap-5">
          {/* Large Avatar */}
          <div className="flex-shrink-0">
            <AvatarImage
              blob={profile.avatarBlob}
              displayName={profile.displayName}
              username={profile.username}
              size="xl"
              className="!w-24 !h-24 !text-2xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="min-w-0">
                <h1 className="font-display text-xl font-bold text-foreground truncate leading-tight">
                  {profile.displayName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  @{profile.username}
                </p>
              </div>
              {isOwnProfile ? (
                <Button
                  data-ocid="profile.edit_profile_button"
                  size="sm"
                  variant="outline"
                  onClick={() => navigate({ to: "/profile/me" })}
                  className="flex-shrink-0"
                >
                  Edit profile
                </Button>
              ) : (
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isAuthenticated && (
                    <Button
                      data-ocid="profile.chat_button"
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() =>
                        navigate({ to: `/chat/${profile.username}` })
                      }
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Message
                    </Button>
                  )}
                  <FollowButton
                    targetPrincipal={profile.principal}
                    targetUsername={profile.username}
                  />
                </div>
              )}
            </div>

            {profile.bio && (
              <p className="text-sm text-foreground leading-relaxed mt-2 mb-3">
                {profile.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex gap-5 mt-3 text-sm">
              <span className="font-semibold text-foreground">
                {Number(profile.postCount)}
                <span className="font-normal text-muted-foreground ml-1">
                  posts
                </span>
              </span>
              <span className="font-semibold text-foreground">
                {Number(profile.followerCount)}
                <span className="font-normal text-muted-foreground ml-1">
                  followers
                </span>
              </span>
              <span className="font-semibold text-foreground">
                {Number(profile.followingCount)}
                <span className="font-normal text-muted-foreground ml-1">
                  following
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* ── Tabs ── */}
      <Tabs defaultValue="posts" data-ocid="profile.tabs">
        <TabsList className="w-full rounded-none border-b border-border bg-transparent h-11 gap-0 px-0">
          <TabsTrigger
            data-ocid="profile.posts_tab"
            value="posts"
            className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent gap-1.5 text-xs font-medium uppercase tracking-wide"
          >
            <Grid3X3 className="h-3.5 w-3.5" />
            Posts
          </TabsTrigger>
          <TabsTrigger
            data-ocid="profile.followers_tab"
            value="followers"
            className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent gap-1.5 text-xs font-medium uppercase tracking-wide"
          >
            <Users className="h-3.5 w-3.5" />
            Followers
          </TabsTrigger>
          <TabsTrigger
            data-ocid="profile.following_tab"
            value="following"
            className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent gap-1.5 text-xs font-medium uppercase tracking-wide"
          >
            <Users className="h-3.5 w-3.5" />
            Following
          </TabsTrigger>
        </TabsList>

        {/* Posts Grid */}
        <TabsContent value="posts" className="mt-0 focus-visible:outline-none">
          {postsLoading ? (
            <div
              data-ocid="profile.posts_loading_state"
              className="grid grid-cols-3 gap-0.5 p-0.5"
            >
              {["a", "b", "c", "d", "e", "f", "g", "h", "i"].map((k) => (
                <Skeleton
                  key={`pg-${k}`}
                  className="aspect-square w-full rounded-none"
                />
              ))}
            </div>
          ) : !posts || posts.length === 0 ? (
            <div
              data-ocid="profile.posts_empty_state"
              className="flex flex-col items-center py-16 px-4 text-center"
            >
              <ImageOff className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="font-medium text-foreground mb-1">No posts yet</p>
              <p className="text-sm text-muted-foreground">
                When {profile.displayName} posts, you'll see them here.
              </p>
            </div>
          ) : (
            <div
              data-ocid="profile.posts_grid"
              className="grid grid-cols-3 gap-0.5 p-0.5"
            >
              {posts.map((post, i) => (
                <PostThumbnail key={post.id.toString()} post={post} index={i} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Followers List */}
        <TabsContent
          value="followers"
          className="mt-0 focus-visible:outline-none"
        >
          {followerList.length === 0 ? (
            <div
              data-ocid="profile.followers_empty_state"
              className="flex flex-col items-center py-16 px-4 text-center"
            >
              <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="font-medium text-foreground mb-1">
                No followers yet
              </p>
              <p className="text-sm text-muted-foreground">
                Be the first to follow {profile.displayName}.
              </p>
            </div>
          ) : (
            <div
              data-ocid="profile.followers_list"
              className="divide-y divide-border"
            >
              {followerList.map((principal, i) => (
                <UserListItem
                  key={principal}
                  principal={principal}
                  index={i}
                  showChat={false}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Following List */}
        <TabsContent
          value="following"
          className="mt-0 focus-visible:outline-none"
        >
          {followingList.length === 0 ? (
            <div
              data-ocid="profile.following_empty_state"
              className="flex flex-col items-center py-16 px-4 text-center"
            >
              <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="font-medium text-foreground mb-1">
                Not following anyone
              </p>
              <p className="text-sm text-muted-foreground">
                {profile.displayName} hasn't followed anyone yet.
              </p>
            </div>
          ) : (
            <div
              data-ocid="profile.following_list"
              className="divide-y divide-border"
            >
              {followingList.map((principal, i) => (
                <UserListItem
                  key={principal}
                  principal={principal}
                  index={i}
                  showChat={true}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
