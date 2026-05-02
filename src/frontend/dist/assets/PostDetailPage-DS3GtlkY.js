import { m as useParams, c as useNavigate, u as useAuth, a as useActor, b as useQueryClient, r as reactExports, d as useQuery, e as useMutation, j as jsxRuntimeExports, M as MessageCircle, B as Button, f as formatDistanceToNow, A as AvatarImage, T as Textarea, l as ue, X, g as createActor } from "./index-Dq5HxgdE.js";
import { S as Skeleton } from "./index-CUHXBakE.js";
import { A as ArrowLeft } from "./arrow-left-AnlBr9zU.js";
import { T as Trash2 } from "./trash-2-CdAgWrPm.js";
import { H as Heart } from "./heart-BMd5N4lW.js";
const PAGE_SIZE = 20n;
function PostDetailPage() {
  var _a;
  const { postId } = useParams({ from: "/post/$postId" });
  const navigate = useNavigate();
  const { isAuthenticated, principal } = useAuth();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = reactExports.useState("");
  const [optimisticComments, setOptimisticComments] = reactExports.useState([]);
  const [commentsOffset, setCommentsOffset] = reactExports.useState(0n);
  const [allComments, setAllComments] = reactExports.useState([]);
  const [hasMore, setHasMore] = reactExports.useState(false);
  const postIdBig = BigInt(postId);
  const {
    data: post,
    isLoading: postLoading,
    refetch: refetchPost
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPost(postIdBig);
    },
    enabled: !!actor && !isFetching
  });
  const { data: authorProfile } = useQuery({
    queryKey: ["profile", (_a = post == null ? void 0 : post.authorPrincipal) == null ? void 0 : _a.toString()],
    queryFn: async () => {
      if (!actor || !post) return null;
      return actor.getUserProfile(post.authorPrincipal);
    },
    enabled: !!actor && !!post,
    staleTime: 6e4
  });
  const { data: isLiked } = useQuery({
    queryKey: ["isLiked", postId],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isLiked(postIdBig);
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", postId, "0"],
    queryFn: async () => {
      if (!actor) return null;
      const page = await actor.listComments(postIdBig, 0n, PAGE_SIZE);
      setAllComments(page.items);
      setHasMore(page.nextOffset != null);
      return page;
    },
    enabled: !!actor && !isFetching
  });
  const isOwn = principal !== null && (post == null ? void 0 : post.authorPrincipal.toString()) === principal;
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.toggleLike(postIdBig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isLiked", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      refetchPost();
    }
  });
  const deletePostMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.deletePost(postIdBig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      ue.success("Post deleted.");
      navigate({ to: "/home" });
    },
    onError: () => ue.error("Failed to delete post.")
  });
  const addCommentMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.addComment(postIdBig, commentText.trim());
    },
    onMutate: () => {
      const text = commentText.trim();
      const temp = {
        id: BigInt(Date.now()) * -1n,
        postId: postIdBig,
        authorPrincipal: {
          toString: () => principal ?? ""
        },
        text,
        createdAt: BigInt(Date.now()) * 1000000n
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
      ue.error("Failed to post comment.");
    }
  });
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
    onError: () => ue.error("Failed to load more comments.")
  });
  if (postLoading || isFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "post_detail.loading_state",
        className: "max-w-2xl mx-auto px-4 py-6 space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "feed-card overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full aspect-square" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" })
            ] })
          ] })
        ]
      }
    );
  }
  if (!post) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "post_detail.not_found",
        className: "max-w-2xl mx-auto px-4 py-24 text-center space-y-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "mx-auto h-12 w-12 text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-medium", children: "Post not found." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => navigate({ to: "/home" }), children: "Go back home" })
        ]
      }
    );
  }
  const authorUsername = (authorProfile == null ? void 0 : authorProfile.username) ?? "user";
  const likeCount = Number(post.likeCount);
  const commentCount = Number(post.commentCount);
  const timeAgo = formatDistanceToNow(
    new Date(Number(post.createdAt / 1000000n)),
    { addSuffix: true }
  );
  const displayedComments = [...optimisticComments, ...allComments];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "post_detail.page",
      className: "max-w-2xl mx-auto px-4 py-6 pb-28 md:pb-8",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "post_detail.back_button",
            className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-smooth mb-5",
            onClick: () => navigate({ to: "/home" }),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
              "Back"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "article",
          {
            "data-ocid": "post_detail.post_card",
            className: "feed-card mb-6 overflow-hidden",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 pt-4 pb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "post_detail.author_link",
                    className: "flex items-center gap-3 min-w-0 hover:opacity-80 transition-smooth",
                    onClick: () => navigate({ to: `/profile/${authorUsername}` }),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        AvatarImage,
                        {
                          blob: authorProfile == null ? void 0 : authorProfile.avatarBlob,
                          displayName: authorProfile == null ? void 0 : authorProfile.displayName,
                          username: authorProfile == null ? void 0 : authorProfile.username,
                          size: "md"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 text-left", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate leading-tight", children: (authorProfile == null ? void 0 : authorProfile.displayName) ?? "Loading…" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
                          "@",
                          authorUsername
                        ] })
                      ] })
                    ]
                  }
                ),
                isOwn && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "post_detail.delete_post_button",
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8 text-muted-foreground hover:text-destructive",
                    disabled: deletePostMutation.isPending,
                    onClick: () => {
                      if (confirm("Delete this post?")) deletePostMutation.mutate();
                    },
                    "aria-label": "Delete post",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                  }
                ) })
              ] }),
              post.photoBlob && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: post.photoBlob.getDirectURL(),
                  alt: "Post content",
                  className: "w-full max-h-[640px] object-contain"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-3 pb-1", children: post.caption && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground leading-relaxed", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold mr-1.5", children: (authorProfile == null ? void 0 : authorProfile.displayName) ?? authorUsername }),
                post.caption
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 px-3 py-2 mt-1 border-t border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    "data-ocid": "post_detail.like_button",
                    variant: "ghost",
                    size: "sm",
                    disabled: !isAuthenticated || likeMutation.isPending,
                    onClick: () => likeMutation.mutate(),
                    className: `gap-1.5 ${isLiked ? "text-primary" : "text-muted-foreground"}`,
                    "aria-label": isLiked ? "Unlike" : "Like",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `h-5 w-5 ${isLiked ? "fill-current" : ""}` }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: likeCount })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "gap-1.5 text-muted-foreground pointer-events-none",
                    "aria-label": "Comments",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: commentCount })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground pr-1", children: timeAgo })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "post_detail.comments_section", className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-semibold text-foreground flex items-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4 text-muted-foreground" }),
            "Comments",
            commentCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal text-sm", children: [
              "(",
              commentCount,
              ")"
            ] })
          ] }),
          isAuthenticated ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "post_detail.comment_form", className: "flex gap-3 mb-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                "data-ocid": "post_detail.comment_input",
                placeholder: "Write a comment…",
                value: commentText,
                onChange: (e) => setCommentText(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && commentText.trim()) {
                    addCommentMutation.mutate();
                  }
                },
                rows: 2,
                className: "resize-none text-sm flex-1",
                maxLength: 500
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "post_detail.comment_submit_button",
                size: "sm",
                className: "btn-primary self-end",
                disabled: !commentText.trim() || addCommentMutation.isPending,
                onClick: () => addCommentMutation.mutate(),
                children: "Post"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mb-5 p-3 bg-muted/40 rounded-lg text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "post_detail.login_to_comment_button",
                className: "text-primary hover:underline font-medium",
                onClick: () => navigate({ to: "/" }),
                children: "Sign in"
              }
            ),
            " ",
            "to leave a comment."
          ] }),
          commentsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "post_detail.comments_loading_state",
              className: "space-y-3",
              children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-8 h-8 rounded-full flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 flex-1 rounded-xl" })
              ] }, i))
            }
          ) : displayedComments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "post_detail.comments_empty_state",
              className: "text-center py-10 text-sm text-muted-foreground",
              children: "No comments yet — be the first!"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "post_detail.comments_list", className: "space-y-2.5", children: [
            displayedComments.map((comment, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              CommentItem,
              {
                comment,
                index: i + 1,
                postId: postIdBig,
                currentPrincipal: principal,
                onDeleted: (id) => setAllComments((prev) => prev.filter((c) => c.id !== id))
              },
              comment.id.toString()
            )),
            hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "post_detail.load_more_button",
                variant: "ghost",
                size: "sm",
                className: "text-muted-foreground hover:text-foreground",
                disabled: loadMoreMutation.isPending,
                onClick: () => loadMoreMutation.mutate(),
                children: loadMoreMutation.isPending ? "Loading…" : "Load more comments"
              }
            ) })
          ] })
        ] })
      ]
    }
  );
}
function CommentItem({
  comment,
  index,
  postId,
  currentPrincipal,
  onDeleted
}) {
  const { actor, isFetching } = useActor(createActor);
  const navigate = useNavigate();
  const isOwn = currentPrincipal !== null && comment.authorPrincipal.toString() === currentPrincipal;
  const { data: author } = useQuery({
    queryKey: ["profile", comment.authorPrincipal.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(comment.authorPrincipal);
    },
    enabled: !!actor && !isFetching && comment.id > 0n,
    // skip optimistic
    staleTime: 6e4
  });
  const deleteCommentMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.deleteComment(postId, comment.id);
    },
    onSuccess: () => {
      onDeleted(comment.id);
      ue.success("Comment deleted.");
    },
    onError: () => ue.error("Failed to delete comment.")
  });
  const authorUsername = (author == null ? void 0 : author.username) ?? "user";
  const timeAgo = formatDistanceToNow(
    new Date(Number(comment.createdAt / 1000000n)),
    { addSuffix: true }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `post_detail.comment.${index}`,
      className: `flex gap-3 group ${comment.id < 0n ? "opacity-60" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "flex-shrink-0 hover:opacity-80 transition-smooth",
            onClick: () => navigate({ to: `/profile/${authorUsername}` }),
            "aria-label": `View ${authorUsername}'s profile`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              AvatarImage,
              {
                blob: author == null ? void 0 : author.avatarBlob,
                displayName: author == null ? void 0 : author.displayName,
                username: author == null ? void 0 : author.username,
                size: "sm"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 bg-muted/40 rounded-xl px-3 py-2.5 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2 flex-wrap mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `post_detail.comment_author.${index}`,
                className: "text-sm font-semibold text-foreground hover:underline leading-tight",
                onClick: () => navigate({ to: `/profile/${authorUsername}` }),
                children: (author == null ? void 0 : author.displayName) ?? "User"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: timeAgo })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed break-words", children: comment.text }),
          isOwn && comment.id > 0n && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": `post_detail.comment_delete_button.${index}`,
              variant: "ghost",
              size: "icon",
              className: "absolute top-1.5 right-1.5 h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-smooth",
              disabled: deleteCommentMutation.isPending,
              onClick: () => deleteCommentMutation.mutate(),
              "aria-label": "Delete comment",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
            }
          )
        ] })
      ]
    }
  );
}
export {
  PostDetailPage as default
};
