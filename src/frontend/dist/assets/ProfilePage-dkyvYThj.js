const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-CUHXBakE.js","assets/index-Dq5HxgdE.js","assets/index-CiV1uXCF.css"])))=>i.map(i=>d[i]);
import { n as createLucideIcon, m as useParams, a as useActor, u as useAuth, c as useNavigate, d as useQuery, j as jsxRuntimeExports, A as AvatarImage, B as Button, M as MessageCircle, g as createActor, _ as __vitePreload } from "./index-Dq5HxgdE.js";
import { F as FollowButton } from "./FollowButton-D4Ho14J4.js";
import { S as Skeleton } from "./index-CUHXBakE.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BnVn6Uwf.js";
import { G as Grid3x3, I as ImageOff } from "./image-off-Bst7nu7a.js";
import { U as Users } from "./users-BloIa0Op.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "17", x2: "22", y1: "8", y2: "13", key: "3nzzx3" }],
  ["line", { x1: "22", x2: "17", y1: "8", y2: "13", key: "1swrse" }]
];
const UserX = createLucideIcon("user-x", __iconNode);
const THUMB_COLORS = [
  "bg-primary/20",
  "bg-accent/20",
  "bg-secondary",
  "bg-muted",
  "bg-primary/10",
  "bg-accent/10"
];
function PostThumbnail({
  post,
  index
}) {
  const navigate = useNavigate();
  const colorClass = THUMB_COLORS[index % THUMB_COLORS.length];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": `profile.post_thumb.${index + 1}`,
      className: "aspect-square w-full overflow-hidden rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none group relative",
      onClick: () => navigate({ to: `/post/${post.id}` }),
      "aria-label": `View post: ${post.caption.slice(0, 40)}`,
      children: [
        post.photoBlob ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: post.photoBlob.getDirectURL(),
            alt: post.caption || "Post photo",
            className: "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-full h-full flex items-center justify-center p-2 ${colorClass}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/80 text-center line-clamp-4 leading-relaxed font-body", children: post.caption })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-200" })
      ]
    }
  );
}
function UserListItem({
  principal,
  index,
  showChat
}) {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const { isAuthenticated, principal: myPrincipal } = useAuth();
  const { data: profile } = useQuery({
    queryKey: ["profile", principal],
    queryFn: async () => {
      if (!actor) return null;
      const { Principal } = await __vitePreload(async () => {
        const { Principal: Principal2 } = await import("./index-CUHXBakE.js").then((n) => n.i);
        return { Principal: Principal2 };
      }, true ? __vite__mapDeps([0,1,2]) : void 0);
      return actor.getUserProfile(Principal.fromText(principal));
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
  const isOwnProfile = myPrincipal === principal;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `profile.follower_item.${index + 1}`,
      className: "flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "flex items-center gap-3 flex-1 min-w-0 text-left",
            onClick: () => profile && navigate({ to: `/profile/${profile.username}` }),
            "aria-label": `View ${(profile == null ? void 0 : profile.displayName) ?? "user"}'s profile`,
            children: [
              profile ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                AvatarImage,
                {
                  blob: profile.avatarBlob,
                  displayName: profile.displayName,
                  username: profile.username,
                  size: "sm"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-8 h-8 rounded-full flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0", children: profile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate leading-tight", children: profile.displayName }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
                  "@",
                  profile.username
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-28" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
              ] }) })
            ]
          }
        ),
        profile && !isOwnProfile && isAuthenticated && (showChat ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": `profile.chat_button.${index + 1}`,
            size: "icon",
            variant: "ghost",
            className: "flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-primary",
            "aria-label": `Message ${profile.displayName}`,
            onClick: () => navigate({ to: `/chat/${profile.username}` }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          FollowButton,
          {
            targetPrincipal: profile.principal,
            targetUsername: profile.username,
            size: "sm"
          }
        ))
      ]
    }
  );
}
function ProfileHeaderSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "profile.loading_state",
      className: "max-w-2xl mx-auto px-4 py-8",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-24 h-24 rounded-full flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-3 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-44" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full max-w-xs" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-1", children: ["a", "b", "c", "d", "e", "f", "g", "h", "i"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "aspect-square w-full rounded-sm" }, k)) })
      ]
    }
  );
}
function ProfilePage() {
  var _a, _b, _c;
  const { username } = useParams({ from: "/profile/$username" });
  const { actor, isFetching } = useActor(createActor);
  const { isAuthenticated, principal: myPrincipal } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useQuery(
    {
      queryKey: ["profileByUsername", username],
      queryFn: async () => {
        if (!actor) return null;
        const page = await actor.getExploreFeed(0n, 500n);
        const seen = /* @__PURE__ */ new Set();
        const uniquePrincipals = [];
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
            batch.map((p) => actor.getUserProfile(p))
          );
          const match = profiles.find((p) => (p == null ? void 0 : p.username) === username);
          if (match) return match;
        }
        return null;
      },
      enabled: !!actor && !isFetching,
      staleTime: 3e4
    }
  );
  const isOwnProfile = isAuthenticated && myPrincipal !== null && (profile == null ? void 0 : profile.principal.toString()) === myPrincipal;
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", (_a = profile == null ? void 0 : profile.principal) == null ? void 0 : _a.toString()],
    queryFn: async () => {
      if (!actor || !profile) return [];
      const page = await actor.listPostsByAuthor(profile.principal, 0n, 60n);
      return page.items;
    },
    enabled: !!actor && !isFetching && !!profile,
    staleTime: 3e4
  });
  const { data: followerPrincipals } = useQuery({
    queryKey: ["followers", (_b = profile == null ? void 0 : profile.principal) == null ? void 0 : _b.toString()],
    queryFn: async () => {
      if (!actor || !profile) return [];
      const page = await actor.getFollowers(profile.principal, 0n, 50n);
      return page.items.map((p) => p.toString());
    },
    enabled: !!actor && !isFetching && !!profile,
    staleTime: 3e4
  });
  const { data: followingPrincipals } = useQuery({
    queryKey: ["following", (_c = profile == null ? void 0 : profile.principal) == null ? void 0 : _c.toString()],
    queryFn: async () => {
      if (!actor || !profile) return [];
      const page = await actor.getFollowing(profile.principal, 0n, 50n);
      return page.items.map((p) => p.toString());
    },
    enabled: !!actor && !isFetching && !!profile,
    staleTime: 3e4
  });
  if (profileLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileHeaderSkeleton, {});
  if (!profile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "profile.not_found",
        className: "max-w-2xl mx-auto px-4 py-20 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "h-14 w-14 text-muted-foreground mx-auto mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground mb-2", children: "User not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "@",
            username,
            " doesn't exist or hasn't appeared in the public feed yet."
          ] })
        ]
      }
    );
  }
  const followerList = followerPrincipals ?? [];
  const followingList = followingPrincipals ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "profile.page", className: "max-w-2xl mx-auto pb-24 md:pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-6 pb-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        AvatarImage,
        {
          blob: profile.avatarBlob,
          displayName: profile.displayName,
          username: profile.username,
          size: "xl",
          className: "!w-24 !h-24 !text-2xl"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground truncate leading-tight", children: profile.displayName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "@",
              profile.username
            ] })
          ] }),
          isOwnProfile ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "profile.edit_profile_button",
              size: "sm",
              variant: "outline",
              onClick: () => navigate({ to: "/profile/me" }),
              className: "flex-shrink-0",
              children: "Edit profile"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
            isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "profile.chat_button",
                size: "sm",
                variant: "outline",
                className: "gap-1.5",
                onClick: () => navigate({ to: `/chat/${profile.username}` }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3.5 w-3.5" }),
                  "Message"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FollowButton,
              {
                targetPrincipal: profile.principal,
                targetUsername: profile.username
              }
            )
          ] })
        ] }),
        profile.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed mt-2 mb-3", children: profile.bio }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-5 mt-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
            Number(profile.postCount),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-muted-foreground ml-1", children: "posts" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
            Number(profile.followerCount),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-muted-foreground ml-1", children: "followers" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
            Number(profile.followingCount),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-muted-foreground ml-1", children: "following" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "posts", "data-ocid": "profile.tabs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full rounded-none border-b border-border bg-transparent h-11 gap-0 px-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            "data-ocid": "profile.posts_tab",
            value: "posts",
            className: "flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent gap-1.5 text-xs font-medium uppercase tracking-wide",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "h-3.5 w-3.5" }),
              "Posts"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            "data-ocid": "profile.followers_tab",
            value: "followers",
            className: "flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent gap-1.5 text-xs font-medium uppercase tracking-wide",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
              "Followers"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            "data-ocid": "profile.following_tab",
            value: "following",
            className: "flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent gap-1.5 text-xs font-medium uppercase tracking-wide",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
              "Following"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "posts", className: "mt-0 focus-visible:outline-none", children: postsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "profile.posts_loading_state",
          className: "grid grid-cols-3 gap-0.5 p-0.5",
          children: ["a", "b", "c", "d", "e", "f", "g", "h", "i"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Skeleton,
            {
              className: "aspect-square w-full rounded-none"
            },
            `pg-${k}`
          ))
        }
      ) : !posts || posts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "profile.posts_empty_state",
          className: "flex flex-col items-center py-16 px-4 text-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "h-12 w-12 text-muted-foreground/50 mb-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground mb-1", children: "No posts yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "When ",
              profile.displayName,
              " posts, you'll see them here."
            ] })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "profile.posts_grid",
          className: "grid grid-cols-3 gap-0.5 p-0.5",
          children: posts.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(PostThumbnail, { post, index: i }, post.id.toString()))
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabsContent,
        {
          value: "followers",
          className: "mt-0 focus-visible:outline-none",
          children: followerList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "profile.followers_empty_state",
              className: "flex flex-col items-center py-16 px-4 text-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-12 w-12 text-muted-foreground/50 mb-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground mb-1", children: "No followers yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  "Be the first to follow ",
                  profile.displayName,
                  "."
                ] })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "profile.followers_list",
              className: "divide-y divide-border",
              children: followerList.map((principal, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                UserListItem,
                {
                  principal,
                  index: i,
                  showChat: false
                },
                principal
              ))
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabsContent,
        {
          value: "following",
          className: "mt-0 focus-visible:outline-none",
          children: followingList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "profile.following_empty_state",
              className: "flex flex-col items-center py-16 px-4 text-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-12 w-12 text-muted-foreground/50 mb-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground mb-1", children: "Not following anyone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  profile.displayName,
                  " hasn't followed anyone yet."
                ] })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "profile.following_list",
              className: "divide-y divide-border",
              children: followingList.map((principal, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                UserListItem,
                {
                  principal,
                  index: i,
                  showChat: true
                },
                principal
              ))
            }
          )
        }
      )
    ] })
  ] });
}
export {
  ProfilePage as default
};
