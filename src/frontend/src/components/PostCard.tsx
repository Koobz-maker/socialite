import { createActor } from "@/backend";
import type { Profile } from "@/backend";
import { AvatarImage } from "@/components/AvatarImage";
import { FollowButton } from "@/components/FollowButton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import type { Post } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Heart, Loader2, MessageCircle, Trash2 } from "lucide-react";

interface PostCardProps {
  post: Post;
  index: number;
  onDeleted?: () => void;
}

function usePostAuthor(authorPrincipal: Post["authorPrincipal"]) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Profile | null>({
    queryKey: ["profile", authorPrincipal.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(authorPrincipal);
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function PostCard({ post, index, onDeleted }: PostCardProps) {
  const { isAuthenticated, principal } = useAuth();
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const isOwn =
    principal !== null && post.authorPrincipal.toString() === principal;

  const { data: authorProfile } = usePostAuthor(post.authorPrincipal);

  const { data: isLiked } = useQuery<boolean>({
    queryKey: ["isLiked", post.id.toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isLiked(post.id);
    },
    enabled: !!actor && isAuthenticated,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.toggleLike(post.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["isLiked", post.id.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["explore"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.deletePost(post.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["explore"] });
      onDeleted?.();
    },
  });

  const handleDelete = () => {
    if (window.confirm("Delete this post? This cannot be undone.")) {
      deleteMutation.mutate();
    }
  };

  const timeAgo = formatDistanceToNow(
    new Date(Number(post.createdAt / 1_000_000n)),
    { addSuffix: true },
  );

  const authorUsername = authorProfile?.username ?? "user";

  return (
    <article data-ocid={`post.item.${index}`} className="feed-card mb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button
          type="button"
          data-ocid={`post.author.${index}`}
          className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-smooth"
          onClick={() => navigate({ to: `/profile/${authorUsername}` })}
        >
          <AvatarImage
            blob={authorProfile?.avatarBlob}
            displayName={authorProfile?.displayName}
            username={authorProfile?.username}
            size="sm"
          />
          <div className="min-w-0 text-left">
            <p className="font-semibold text-sm text-foreground truncate leading-tight">
              {authorProfile?.displayName ?? "Loading..."}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              @{authorUsername}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Only show Follow button on other users' posts */}
          {!isOwn && (
            <FollowButton
              targetPrincipal={post.authorPrincipal}
              targetUsername={authorUsername}
            />
          )}

          {/* Delete button — only for post owner */}
          {isOwn && (
            <Button
              data-ocid={`post.delete_button.${index}`}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              disabled={deleteMutation.isPending}
              onClick={handleDelete}
              aria-label="Delete post"
              title="Delete post"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Caption */}
      {post.caption && (
        <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">
          {post.caption}
        </p>
      )}

      {/* Photo */}
      {post.photoBlob && (
        <button
          type="button"
          data-ocid={`post.image.${index}`}
          className="w-full aspect-[4/3] bg-muted overflow-hidden cursor-pointer block"
          onClick={() => navigate({ to: `/post/${post.id}` })}
          onKeyDown={(e) =>
            e.key === "Enter" && navigate({ to: `/post/${post.id}` })
          }
          aria-label="View post details"
        >
          <img
            src={post.photoBlob.getDirectURL()}
            alt="Post content"
            className="w-full h-full object-cover"
          />
        </button>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 py-2 border-t border-border">
        <Button
          data-ocid={`post.like_button.${index}`}
          variant="ghost"
          size="sm"
          disabled={!isAuthenticated || likeMutation.isPending}
          onClick={() => likeMutation.mutate()}
          className={`gap-1.5 ${isLiked ? "text-primary" : "text-muted-foreground"}`}
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          <span>{Number(post.likeCount)}</span>
        </Button>

        <Button
          data-ocid={`post.comment_button.${index}`}
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground"
          onClick={() => navigate({ to: `/post/${post.id}` })}
          aria-label="View comments"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{Number(post.commentCount)}</span>
        </Button>

        <span className="ml-auto text-xs text-muted-foreground pr-2">
          {timeAgo}
        </span>
      </div>
    </article>
  );
}
