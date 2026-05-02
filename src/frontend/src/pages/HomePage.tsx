import { createActor } from "@/backend";
import { PostCard } from "@/components/PostCard";
import { PostCreateModal } from "@/components/PostCreateModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import type { Page, Post } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Compass, PenLine, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const PAGE_SIZE = 20n;

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="feed-card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-4/5" />
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="flex gap-4 pt-1">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-7 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyFeed() {
  return (
    <div
      data-ocid="home.feed_empty_state"
      className="flex flex-col items-center justify-center py-24 text-center px-6"
    >
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5 shadow-inner">
        <Users className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="font-display font-semibold text-xl text-foreground mb-2">
        Your feed is empty
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
        Follow some users to see their posts here. Discover creators on the
        Explore page.
      </p>
      <Link to="/explore">
        <Button
          data-ocid="home.explore_link"
          className="gap-2"
          variant="default"
        >
          <Compass className="h-4 w-4" />
          Explore creators
        </Button>
      </Link>
    </div>
  );
}

export default function HomePage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const handlePostDeleted = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["feed"] });
  }, [queryClient]);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery<Page<Post>>({
      queryKey: ["feed"],
      queryFn: async ({ pageParam }) => {
        if (!actor) return { items: [], total: 0n, nextOffset: undefined };
        return actor.getHomeFeed(pageParam as bigint, PAGE_SIZE);
      },
      initialPageParam: 0n as bigint,
      getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
      enabled: !!actor && !isFetching && isAuthenticated,
    });

  const allPosts = data?.pages.flatMap((p) => p.items) ?? [];

  if (!isAuthenticated && !isInitializing) return null;

  return (
    <div
      data-ocid="home.page"
      className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6"
    >
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Home
        </h1>
        <Button
          data-ocid="home.create_post_button"
          onClick={() => setModalOpen(true)}
          className="gap-2"
          size="sm"
        >
          <PenLine className="h-4 w-4" />
          <span className="hidden sm:inline">Create post</span>
          <span className="sm:hidden">Post</span>
        </Button>
      </div>

      {/* Feed */}
      {isLoading ? (
        <FeedSkeleton />
      ) : allPosts.length === 0 ? (
        <EmptyFeed />
      ) : (
        <>
          <div data-ocid="home.feed_list" className="space-y-0">
            {allPosts.map((post, i) => (
              <PostCard
                key={post.id.toString()}
                post={post}
                index={i + 1}
                onDeleted={handlePostDeleted}
              />
            ))}
          </div>

          {/* Load More */}
          {hasNextPage && (
            <div className="mt-4 flex justify-center">
              <Button
                data-ocid="home.load_more_button"
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full sm:w-auto"
              >
                {isFetchingNextPage ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Loading…
                  </>
                ) : (
                  "Load more posts"
                )}
              </Button>
            </div>
          )}

          {!hasNextPage && allPosts.length > 0 && (
            <p
              data-ocid="home.feed_end"
              className="text-center text-xs text-muted-foreground mt-8 pb-2"
            >
              You're all caught up ✓
            </p>
          )}
        </>
      )}

      {/* Create Post Modal */}
      <PostCreateModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
