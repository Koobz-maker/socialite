import { u as useAuth, a as useActor, b as useQueryClient, c as useNavigate, d as useQuery, e as useMutation, f as formatDistanceToNow, j as jsxRuntimeExports, A as AvatarImage, B as Button, M as MessageCircle, g as createActor } from "./index-Dq5HxgdE.js";
import { F as FollowButton } from "./FollowButton-D4Ho14J4.js";
import { L as LoaderCircle } from "./loader-circle-DFUpN1H0.js";
import { T as Trash2 } from "./trash-2-CdAgWrPm.js";
import { H as Heart } from "./heart-BMd5N4lW.js";
function usePostAuthor(authorPrincipal) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["profile", authorPrincipal.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(authorPrincipal);
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
}
function PostCard({ post, index, onDeleted }) {
  const { isAuthenticated, principal } = useAuth();
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isOwn = principal !== null && post.authorPrincipal.toString() === principal;
  const { data: authorProfile } = usePostAuthor(post.authorPrincipal);
  const { data: isLiked } = useQuery({
    queryKey: ["isLiked", post.id.toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isLiked(post.id);
    },
    enabled: !!actor && isAuthenticated
  });
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.toggleLike(post.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["isLiked", post.id.toString()]
      });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["explore"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    }
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
      onDeleted == null ? void 0 : onDeleted();
    }
  });
  const handleDelete = () => {
    if (window.confirm("Delete this post? This cannot be undone.")) {
      deleteMutation.mutate();
    }
  };
  const timeAgo = formatDistanceToNow(
    new Date(Number(post.createdAt / 1000000n)),
    { addSuffix: true }
  );
  const authorUsername = (authorProfile == null ? void 0 : authorProfile.username) ?? "user";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { "data-ocid": `post.item.${index}`, className: "feed-card mb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 pt-4 pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": `post.author.${index}`,
          className: "flex items-center gap-3 min-w-0 hover:opacity-80 transition-smooth",
          onClick: () => navigate({ to: `/profile/${authorUsername}` }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AvatarImage,
              {
                blob: authorProfile == null ? void 0 : authorProfile.avatarBlob,
                displayName: authorProfile == null ? void 0 : authorProfile.displayName,
                username: authorProfile == null ? void 0 : authorProfile.username,
                size: "sm"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 text-left", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate leading-tight", children: (authorProfile == null ? void 0 : authorProfile.displayName) ?? "Loading..." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
                "@",
                authorUsername
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
        !isOwn && /* @__PURE__ */ jsxRuntimeExports.jsx(
          FollowButton,
          {
            targetPrincipal: post.authorPrincipal,
            targetUsername: authorUsername
          }
        ),
        isOwn && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": `post.delete_button.${index}`,
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
            disabled: deleteMutation.isPending,
            onClick: handleDelete,
            "aria-label": "Delete post",
            title: "Delete post",
            children: deleteMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
          }
        )
      ] })
    ] }),
    post.caption && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-4 pb-3 text-sm text-foreground leading-relaxed", children: post.caption }),
    post.photoBlob && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        "data-ocid": `post.image.${index}`,
        className: "w-full aspect-[4/3] bg-muted overflow-hidden cursor-pointer block",
        onClick: () => navigate({ to: `/post/${post.id}` }),
        onKeyDown: (e) => e.key === "Enter" && navigate({ to: `/post/${post.id}` }),
        "aria-label": "View post details",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: post.photoBlob.getDirectURL(),
            alt: "Post content",
            className: "w-full h-full object-cover"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 px-3 py-2 border-t border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": `post.like_button.${index}`,
          variant: "ghost",
          size: "sm",
          disabled: !isAuthenticated || likeMutation.isPending,
          onClick: () => likeMutation.mutate(),
          className: `gap-1.5 ${isLiked ? "text-primary" : "text-muted-foreground"}`,
          "aria-label": isLiked ? "Unlike" : "Like",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `h-4 w-4 ${isLiked ? "fill-current" : ""}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: Number(post.likeCount) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": `post.comment_button.${index}`,
          variant: "ghost",
          size: "sm",
          className: "gap-1.5 text-muted-foreground",
          onClick: () => navigate({ to: `/post/${post.id}` }),
          "aria-label": "View comments",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: Number(post.commentCount) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground pr-2", children: timeAgo })
    ] })
  ] });
}
export {
  PostCard as P
};
