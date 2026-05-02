import { n as createLucideIcon, a as useActor, b as useQueryClient, r as reactExports, d as useQuery, e as useMutation, j as jsxRuntimeExports, E as Search, B as Button, G as Compass, c as useNavigate, A as AvatarImage, g as createActor } from "./index-Dq5HxgdE.js";
import { F as FollowButton } from "./FollowButton-D4Ho14J4.js";
import { P as PostCard } from "./PostCard-D6kkU3AS.js";
import { I as Input } from "./input-BNCGTdes.js";
import { S as Skeleton } from "./index-CUHXBakE.js";
import { U as Users } from "./users-BloIa0Op.js";
import "./loader-circle-DFUpN1H0.js";
import "./trash-2-CdAgWrPm.js";
import "./heart-BMd5N4lW.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
function PostGridSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "feed-card p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-28" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2.5 w-20" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-52 w-full rounded-lg" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-16" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-16" })
    ] })
  ] }, i)) });
}
function UserCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 w-36 bg-card border border-border rounded-xl p-3 space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-12 h-12 rounded-full mx-auto" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20 mx-auto" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2.5 w-14 mx-auto" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-full rounded-md" })
  ] });
}
function SuggestedUserCard({ user, index }) {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `explore.suggested_user.${index}`,
      className: "flex-shrink-0 w-36 bg-card border border-border rounded-xl p-3 flex flex-col items-center gap-2 transition-smooth hover:shadow-sm",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "flex flex-col items-center gap-1.5 w-full group",
            onClick: () => navigate({ to: `/profile/${user.username}` }),
            "aria-label": `View ${user.displayName}'s profile`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                AvatarImage,
                {
                  blob: user.avatarBlob,
                  displayName: user.displayName,
                  username: user.username,
                  size: "md"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-xs text-foreground truncate w-full text-center leading-tight group-hover:text-primary transition-colors", children: user.displayName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate w-full text-center", children: [
                Number(user.followerCount).toLocaleString(),
                " followers"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FollowButton,
          {
            targetPrincipal: user.principal,
            targetUsername: user.username,
            size: "sm",
            className: "w-full"
          }
        )
      ]
    }
  );
}
const PAGE_SIZE = 12n;
function ExplorePage() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [extraPosts, setExtraPosts] = reactExports.useState([]);
  const [nextOffset, setNextOffset] = reactExports.useState(null);
  const {
    data: trendingPage,
    isLoading: postsLoading,
    isRefetching,
    refetch
  } = useQuery({
    queryKey: ["explore", "trending"],
    queryFn: async () => {
      if (!actor)
        return {
          items: [],
          total: 0n,
          nextOffset: void 0
        };
      const page = await actor.getExploreFeed(0n, PAGE_SIZE);
      return page;
    },
    enabled: !!actor && !isFetching
  });
  const firstPagePosts = (trendingPage == null ? void 0 : trendingPage.items) ?? [];
  const firstPageNextOffset = trendingPage == null ? void 0 : trendingPage.nextOffset;
  const currentOffset = nextOffset ?? (firstPageNextOffset !== void 0 && firstPageNextOffset !== null ? firstPageNextOffset : BigInt(firstPagePosts.length));
  const hasMore = nextOffset !== null ? true : firstPageNextOffset !== void 0 && firstPageNextOffset !== null;
  const displayPosts = [...firstPagePosts, ...extraPosts];
  const { data: suggestedProfiles, isLoading: usersLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      if (!actor) return [];
      const page = await actor.getExploreFeed(0n, 20n);
      const seen = /* @__PURE__ */ new Set();
      const uniquePrincipals = [];
      for (const post of page.items) {
        const key = post.authorPrincipal.toString();
        if (!seen.has(key)) {
          seen.add(key);
          uniquePrincipals.push(post.authorPrincipal);
          if (uniquePrincipals.length >= 10) break;
        }
      }
      const profiles = await Promise.all(
        uniquePrincipals.map((p) => actor.getUserProfile(p))
      );
      return profiles.filter((p) => p !== null).map(
        (p) => ({
          principal: p.principal,
          username: p.username,
          displayName: p.displayName,
          bio: p.bio,
          avatarBlob: p.avatarBlob,
          followerCount: p.followerCount,
          followingCount: p.followingCount,
          postCount: p.postCount,
          createdAt: p.createdAt
        })
      );
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
  const suggestedUsers = suggestedProfiles ?? [];
  const loadMoreMutation = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      const page = await actor.getExploreFeed(currentOffset, PAGE_SIZE);
      setExtraPosts((prev) => [...prev, ...page.items]);
      const newNext = page.nextOffset !== void 0 && page.nextOffset !== null ? page.nextOffset : null;
      setNextOffset(newNext);
    }
  });
  const handleRefresh = () => {
    setExtraPosts([]);
    setNextOffset(null);
    queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
    refetch();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "explore.page",
      className: "max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6 space-y-8",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "explore.search_bar", className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "explore.search_input",
              type: "search",
              placeholder: "Search posts, people, topics…",
              className: "pl-10 h-11 bg-card border-border text-sm placeholder:text-muted-foreground focus-visible:ring-primary/40",
              readOnly: true,
              "aria-label": "Search (coming soon)"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "section",
          {
            "data-ocid": "explore.suggested_users.section",
            "aria-labelledby": "suggested-heading",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    id: "suggested-heading",
                    className: "font-display font-semibold text-base text-foreground",
                    children: "Suggested for you"
                  }
                )
              ] }),
              usersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(UserCardSkeleton, {}, i)) }) : suggestedUsers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4", children: "No suggestions right now. Explore some posts and come back!" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "ul",
                {
                  "data-ocid": "explore.suggested_users.list",
                  className: "flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none list-none m-0 p-0",
                  "aria-label": "Suggested users",
                  children: suggestedUsers.map((user, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "contents", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SuggestedUserCard, { user, index: i + 1 }) }, user.principal.toString()))
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "section",
          {
            "data-ocid": "explore.trending_posts.section",
            "aria-labelledby": "trending-heading",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h2",
                    {
                      id: "trending-heading",
                      className: "font-display font-semibold text-base text-foreground",
                      children: "Trending Posts"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    "data-ocid": "explore.refresh_button",
                    variant: "ghost",
                    size: "sm",
                    onClick: handleRefresh,
                    disabled: postsLoading || isRefetching,
                    className: "gap-1.5 text-muted-foreground hover:text-foreground",
                    "aria-label": "Refresh trending posts",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        RefreshCw,
                        {
                          className: `h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Refresh" })
                    ]
                  }
                )
              ] }),
              postsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(PostGridSkeleton, {}) : displayPosts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  "data-ocid": "explore.empty_state",
                  className: "flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-xl",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Compass, { className: "h-8 w-8 text-muted-foreground" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground mb-1", children: "Nothing trending yet" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: "Be the first to share something — your post could be the one that starts the conversation." })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "explore.posts_list", children: displayPosts.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(PostCard, { post, index: i + 1 }, post.id.toString())) }),
                hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "explore.load_more_button",
                    variant: "outline",
                    size: "default",
                    onClick: () => loadMoreMutation.mutate(),
                    disabled: loadMoreMutation.isPending,
                    className: "w-full max-w-xs",
                    children: loadMoreMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-2 animate-spin" }),
                      "Loading…"
                    ] }) : "Load more"
                  }
                ) })
              ] })
            ]
          }
        )
      ]
    }
  );
}
export {
  ExplorePage as default
};
