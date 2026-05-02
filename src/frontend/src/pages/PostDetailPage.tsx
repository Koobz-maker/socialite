import { createActor } from "@/backend";
import type { Profile } from "@/backend";
import { AvatarImage } from "@/components/AvatarImage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import type { Comment, Post } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Heart, MessageCircle, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 20n;

// ─── PostDetail ────────────────────────────────────────────────────────────

export default function PostDetailPage() {
  const { postId } = useParams({ from: "/post/$postId" });
  const navigate = useNavigate();
  const { isAuthenticated, principal } = useAuth();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const [commentText, setCommentText] = useState("");
  const [optimisticComments, setOptimisticComments] = useState<Comment[]>([]);
  const [commentsOffset, setCommentsOffset] = useState(0n);
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [hasMore, setHasMore] = useState(false);

  const postIdBig = BigInt(postId);

  // ── Fetch post ──────────────────────────────────────────────────────────
  const {
    data: post,
    isLoading: postLoading,
    refetch: refetchPost,
  } = useQuery<Post | null>({
    queryKey: ["post", postId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPost(postIdBig);
    },
    enabled: !!actor && !isFetching,
  });

  // ── Fetch author profile ────────────────────────────────────────────────
  const { data: authorProfile } = useQuery<Profile | null>({
    queryKey: ["profile", post?.authorPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !post) return null;
      return actor.getUserProfile(post.authorPrincipal);
    },
    enabled: !!actor && !!post,
    staleTime: 60_000,
  });

  // ── Fetch like status ───────────────────────────────────────────────────
  const { data: isLiked } = useQuery<boolean>({
    queryKey: ["isLiked", postId],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isLiked(postIdBig);
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  // ── Fetch initial comments page ─────────────────────────────────────────
  const { isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", postId, "0"],
    queryFn: async () => {
      if (!actor) return null;
      const page = await actor.listComments(postIdBig, 0n, PAGE_SIZE);
      setAllComments(page.items);
      setHasMore(page.nextOffset != null);
      return page;
    },
    enabled: !!actor && !isFetching,
  });

  // ── Derived ─────────────────────────────────────────────────────────────
  const isOwn =
    principal !== null && post?.authorPrincipal.toString() === principal;
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.toggleLike(postIdBig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isLiked", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      refetchPost();
    },
  });

  // ── Delete post mutation ─────────────────────────────────────────────────
  const deletePostMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.deletePost(postIdBig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      toast.success("Post deleted.");
      navigate({ to: "/home" });
    },
    onError: () => toast.error("Failed to delete post."),
  });

  // ── Add comment mutation ─────────────────────────────────────────────────
  const addCommentMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.addComment(postIdBig, commentText.trim());
    },
    onMutate: () => {
      const text = commentText.trim();
      const temp: Comment = {
        id: BigInt(Date.now()) * -1n,
        postId: postIdBig,
        authorPrincipal: {
          toString: () => principal ?? "",
        } as Comment["authorPrincipal"],
        text,
        createdAt: BigInt(Date.now()) * 1_000_000n,
      };
      setOptimisticComments((prev) => [temp, ...prev]);
      setCommentText("");
    },
    onSuccess: (newComment) => {
      setOptimisticComments([]);
      setAllComments((prev) => [newComment, ...prev]);
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: () => {
      setOptimisticComments([]);
      toast.error("Failed to post comment.");
    },
  });

  // ── Load more comments ───────────────────────────────────────────────────
  const loadMoreMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const nextOffset = commentsOffset + PAGE_SIZE;
      const page = await actor.listComments(postIdBig, nextOffset, PAGE_SIZE);
      return { page, offset: nextOffset };
    },
    onSuccess: ({ page, offset }) => {
      setAllComments((prev) => [...prev, ...page.items]);
      setCommentsOffset(offset);
      setHasMore(page.nextOffset != null);
    },
    onError: () => toast.error("Failed to load more comments."),
  });

  // ── Start editing caption ────────────────────────────────────────────────
  // (caption editing not yet supported by backend)

  // ── Render ───────────────────────────────────────────────────────────────
  if (postLoading || isFetching) {
    return (
      <div
        data-ocid="post_detail.loading_state"
        className="max-w-2xl mx-auto px-4 py-6 space-y-4"
      >
        <Skeleton className="h-7 w-20" />
        <div className="feed-card overflow-hidden">
          <div className="flex items-center gap-3 p-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="w-full aspect-square" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div
        data-ocid="post_detail.not_found"
        className="max-w-2xl mx-auto px-4 py-24 text-center space-y-3"
      >
        <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/40" />
        <p className="text-muted-foreground font-medium">Post not found.</p>
        <Button variant="ghost" onClick={() => navigate({ to: "/home" })}>
          Go back home
        </Button>
      </div>
    );
  }

  const authorUsername = authorProfile?.username ?? "user";
  const likeCount = Number(post.likeCount);
  const commentCount = Number(post.commentCount);
  const timeAgo = formatDistanceToNow(
    new Date(Number(post.createdAt / 1_000_000n)),
    { addSuffix: true },
  );

  const displayedComments = [...optimisticComments, ...allComments];

  return (
    <div
      data-ocid="post_detail.page"
      className="max-w-2xl mx-auto px-4 py-6 pb-28 md:pb-8"
    >
      {/* Back button */}
      <button
        type="button"
        data-ocid="post_detail.back_button"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-5"
        onClick={() => navigate({ to: "/home" })}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Post card */}
      <article
        data-ocid="post_detail.post_card"
        className="feed-card mb-6 overflow-hidden"
      >
        {/* Author header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <button
            type="button"
            data-ocid="post_detail.author_link"
            className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-smooth"
            onClick={() => navigate({ to: `/profile/${authorUsername}` })}
          >
            <AvatarImage
              blob={authorProfile?.avatarBlob}
              displayName={authorProfile?.displayName}
              username={authorProfile?.username}
              size="md"
            />
            <div className="min-w-0 text-left">
              <p className="font-semibold text-sm text-foreground truncate leading-tight">
                {authorProfile?.displayName ?? "Loading…"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                @{authorUsername}
              </p>
            </div>
          </button>

          {/* Owner actions */}
          {isOwn && (
            <div className="flex items-center gap-1">
              <Button
                data-ocid="post_detail.delete_post_button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                disabled={deletePostMutation.isPending}
                onClick={() => {
                  if (confirm("Delete this post?")) deletePostMutation.mutate();
                }}
                aria-label="Delete post"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Full-size photo */}
        {post.photoBlob && (
          <div className="w-full bg-muted">
            <img
              src={post.photoBlob.getDirectURL()}
              alt="Post content"
              className="w-full max-h-[640px] object-contain"
            />
          </div>
        )}

        {/* Caption */}
        <div className="px-4 pt-3 pb-1">
          {post.caption && (
            <p className="text-sm text-foreground leading-relaxed">
              <span className="font-semibold mr-1.5">
                {authorProfile?.displayName ?? authorUsername}
              </span>
              {post.caption}
            </p>
          )}
        </div>

        {/* Actions bar */}
        <div className="flex items-center gap-1 px-3 py-2 mt-1 border-t border-border">
          <Button
            data-ocid="post_detail.like_button"
            variant="ghost"
            size="sm"
            disabled={!isAuthenticated || likeMutation.isPending}
            onClick={() => likeMutation.mutate()}
            className={`gap-1.5 ${isLiked ? "text-primary" : "text-muted-foreground"}`}
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-sm font-medium">{likeCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground pointer-events-none"
            aria-label="Comments"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{commentCount}</span>
          </Button>

          <span className="ml-auto text-xs text-muted-foreground pr-1">
            {timeAgo}
          </span>
        </div>
      </article>

      {/* Comments section */}
      <section data-ocid="post_detail.comments_section" className="space-y-1">
        <h2 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
          Comments
          {commentCount > 0 && (
            <span className="text-muted-foreground font-normal text-sm">
              ({commentCount})
            </span>
          )}
        </h2>

        {/* Add comment form */}
        {isAuthenticated ? (
          <div data-ocid="post_detail.comment_form" className="flex gap-3 mb-5">
            <Textarea
              data-ocid="post_detail.comment_input"
              placeholder="Write a comment…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  (e.metaKey || e.ctrlKey) &&
                  commentText.trim()
                ) {
                  addCommentMutation.mutate();
                }
              }}
              rows={2}
              className="resize-none text-sm flex-1"
              maxLength={500}
            />
            <Button
              data-ocid="post_detail.comment_submit_button"
              size="sm"
              className="btn-primary self-end"
              disabled={!commentText.trim() || addCommentMutation.isPending}
              onClick={() => addCommentMutation.mutate()}
            >
              Post
            </Button>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground mb-5 p-3 bg-muted/40 rounded-lg text-center">
            <button
              type="button"
              data-ocid="post_detail.login_to_comment_button"
              className="text-primary hover:underline font-medium"
              onClick={() => navigate({ to: "/" })}
            >
              Sign in
            </button>{" "}
            to leave a comment.
          </div>
        )}

        {/* Comments list */}
        {commentsLoading ? (
          <div
            data-ocid="post_detail.comments_loading_state"
            className="space-y-3"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                <Skeleton className="h-14 flex-1 rounded-xl" />
              </div>
            ))}
          </div>
        ) : displayedComments.length === 0 ? (
          <div
            data-ocid="post_detail.comments_empty_state"
            className="text-center py-10 text-sm text-muted-foreground"
          >
            No comments yet — be the first!
          </div>
        ) : (
          <div data-ocid="post_detail.comments_list" className="space-y-2.5">
            {displayedComments.map((comment, i) => (
              <CommentItem
                key={comment.id.toString()}
                comment={comment}
                index={i + 1}
                postId={postIdBig}
                currentPrincipal={principal}
                onDeleted={(id) =>
                  setAllComments((prev) => prev.filter((c) => c.id !== id))
                }
              />
            ))}

            {hasMore && (
              <div className="pt-2 text-center">
                <Button
                  data-ocid="post_detail.load_more_button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  disabled={loadMoreMutation.isPending}
                  onClick={() => loadMoreMutation.mutate()}
                >
                  {loadMoreMutation.isPending
                    ? "Loading…"
                    : "Load more comments"}
                </Button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

// ─── CommentItem ───────────────────────────────────────────────────────────

interface CommentItemProps {
  comment: Comment;
  index: number;
  postId: bigint;
  currentPrincipal: string | null;
  onDeleted: (id: bigint) => void;
}

function CommentItem({
  comment,
  index,
  postId,
  currentPrincipal,
  onDeleted,
}: CommentItemProps) {
  const { actor, isFetching } = useActor(createActor);
  const navigate = useNavigate();
  const isOwn =
    currentPrincipal !== null &&
    comment.authorPrincipal.toString() === currentPrincipal;

  const { data: author } = useQuery<Profile | null>({
    queryKey: ["profile", comment.authorPrincipal.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(comment.authorPrincipal);
    },
    enabled: !!actor && !isFetching && comment.id > 0n, // skip optimistic
    staleTime: 60_000,
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.deleteComment(postId, comment.id);
    },
    onSuccess: () => {
      onDeleted(comment.id);
      toast.success("Comment deleted.");
    },
    onError: () => toast.error("Failed to delete comment."),
  });

  const authorUsername = author?.username ?? "user";
  const timeAgo = formatDistanceToNow(
    new Date(Number(comment.createdAt / 1_000_000n)),
    { addSuffix: true },
  );

  return (
    <div
      data-ocid={`post_detail.comment.${index}`}
      className={`flex gap-3 group ${comment.id < 0n ? "opacity-60" : ""}`}
    >
      <button
        type="button"
        className="flex-shrink-0 hover:opacity-80 transition-smooth"
        onClick={() => navigate({ to: `/profile/${authorUsername}` })}
        aria-label={`View ${authorUsername}'s profile`}
      >
        <AvatarImage
          blob={author?.avatarBlob}
          displayName={author?.displayName}
          username={author?.username}
          size="sm"
        />
      </button>

      <div className="flex-1 min-w-0 bg-muted/40 rounded-xl px-3 py-2.5 relative">
        <div className="flex items-baseline gap-2 flex-wrap mb-1">
          <button
            type="button"
            data-ocid={`post_detail.comment_author.${index}`}
            className="text-sm font-semibold text-foreground hover:underline leading-tight"
            onClick={() => navigate({ to: `/profile/${authorUsername}` })}
          >
            {author?.displayName ?? "User"}
          </button>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed break-words">
          {comment.text}
        </p>

        {/* Delete own comment */}
        {isOwn && comment.id > 0n && (
          <Button
            data-ocid={`post_detail.comment_delete_button.${index}`}
            variant="ghost"
            size="icon"
            className="absolute top-1.5 right-1.5 h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-smooth"
            disabled={deleteCommentMutation.isPending}
            onClick={() => deleteCommentMutation.mutate()}
            aria-label="Delete comment"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
