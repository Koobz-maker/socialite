import { Q as QueryObserver, H as infiniteQueryBehavior, J as hasPreviousPage, K as hasNextPage, L as useBaseQuery, n as createLucideIcon, u as useAuth, c as useNavigate, a as useActor, b as useQueryClient, r as reactExports, j as jsxRuntimeExports, B as Button, O as PostCreateModal, V as Link, G as Compass, g as createActor } from "./index-Dq5HxgdE.js";
import { P as PostCard } from "./PostCard-D6kkU3AS.js";
import { S as Skeleton } from "./index-CUHXBakE.js";
import { U as Users } from "./users-BloIa0Op.js";
import "./FollowButton-D4Ho14J4.js";
import "./loader-circle-DFUpN1H0.js";
import "./trash-2-CdAgWrPm.js";
import "./heart-BMd5N4lW.js";
var InfiniteQueryObserver = class extends QueryObserver {
  constructor(client, options) {
    super(client, options);
  }
  bindMethods() {
    super.bindMethods();
    this.fetchNextPage = this.fetchNextPage.bind(this);
    this.fetchPreviousPage = this.fetchPreviousPage.bind(this);
  }
  setOptions(options) {
    super.setOptions({
      ...options,
      behavior: infiniteQueryBehavior()
    });
  }
  getOptimisticResult(options) {
    options.behavior = infiniteQueryBehavior();
    return super.getOptimisticResult(options);
  }
  fetchNextPage(options) {
    return this.fetch({
      ...options,
      meta: {
        fetchMore: { direction: "forward" }
      }
    });
  }
  fetchPreviousPage(options) {
    return this.fetch({
      ...options,
      meta: {
        fetchMore: { direction: "backward" }
      }
    });
  }
  createResult(query, options) {
    var _a, _b;
    const { state } = query;
    const parentResult = super.createResult(query, options);
    const { isFetching, isRefetching, isError, isRefetchError } = parentResult;
    const fetchDirection = (_b = (_a = state.fetchMeta) == null ? void 0 : _a.fetchMore) == null ? void 0 : _b.direction;
    const isFetchNextPageError = isError && fetchDirection === "forward";
    const isFetchingNextPage = isFetching && fetchDirection === "forward";
    const isFetchPreviousPageError = isError && fetchDirection === "backward";
    const isFetchingPreviousPage = isFetching && fetchDirection === "backward";
    const result = {
      ...parentResult,
      fetchNextPage: this.fetchNextPage,
      fetchPreviousPage: this.fetchPreviousPage,
      hasNextPage: hasNextPage(options, state.data),
      hasPreviousPage: hasPreviousPage(options, state.data),
      isFetchNextPageError,
      isFetchingNextPage,
      isFetchPreviousPageError,
      isFetchingPreviousPage,
      isRefetchError: isRefetchError && !isFetchNextPageError && !isFetchPreviousPageError,
      isRefetching: isRefetching && !isFetchingNextPage && !isFetchingPreviousPage
    };
    return result;
  }
};
function useInfiniteQuery(options, queryClient) {
  return useBaseQuery(
    options,
    InfiniteQueryObserver
  );
}
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h9", key: "t2du7b" }],
  [
    "path",
    {
      d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",
      key: "1ykcvy"
    }
  ]
];
const PenLine = createLucideIcon("pen-line", __iconNode);
const PAGE_SIZE = 20n;
function FeedSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "feed-card p-4 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-32" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-4/5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-lg" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-16" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-16" })
    ] })
  ] }, i)) });
}
function EmptyFeed() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "home.feed_empty_state",
      className: "flex flex-col items-center justify-center py-24 text-center px-6",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5 shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-10 w-10 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-xl text-foreground mb-2", children: "Your feed is empty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed", children: "Follow some users to see their posts here. Discover creators on the Explore page." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/explore", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "home.explore_link",
            className: "gap-2",
            variant: "default",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Compass, { className: "h-4 w-4" }),
              "Explore creators"
            ]
          }
        ) })
      ]
    }
  );
}
function HomePage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const handlePostDeleted = reactExports.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["feed"] });
  }, [queryClient]);
  reactExports.useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, isInitializing, navigate]);
  const { data, isLoading, isFetchingNextPage, hasNextPage: hasNextPage2, fetchNextPage } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: async ({ pageParam }) => {
      if (!actor) return { items: [], total: 0n, nextOffset: void 0 };
      return actor.getHomeFeed(pageParam, PAGE_SIZE);
    },
    initialPageParam: 0n,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? void 0,
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const allPosts = (data == null ? void 0 : data.pages.flatMap((p) => p.items)) ?? [];
  if (!isAuthenticated && !isInitializing) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "home.page",
      className: "max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Home" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "home.create_post_button",
              onClick: () => setModalOpen(true),
              className: "gap-2",
              size: "sm",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Create post" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "Post" })
              ]
            }
          )
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(FeedSkeleton, {}) : allPosts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyFeed, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "home.feed_list", className: "space-y-0", children: allPosts.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            PostCard,
            {
              post,
              index: i + 1,
              onDeleted: handlePostDeleted
            },
            post.id.toString()
          )) }),
          hasNextPage2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "home.load_more_button",
              variant: "outline",
              onClick: () => fetchNextPage(),
              disabled: isFetchingNextPage,
              className: "w-full sm:w-auto",
              children: isFetchingNextPage ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" }),
                "Loading…"
              ] }) : "Load more posts"
            }
          ) }),
          !hasNextPage2 && allPosts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              "data-ocid": "home.feed_end",
              className: "text-center text-xs text-muted-foreground mt-8 pb-2",
              children: "You're all caught up ✓"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PostCreateModal, { open: modalOpen, onOpenChange: setModalOpen })
      ]
    }
  );
}
export {
  HomePage as default
};
