import { n as createLucideIcon, j as jsxRuntimeExports, i as cn, u as useAuth, r as reactExports, c as useNavigate, B as Button, W as Shield, a as useActor, M as MessageCircle, x as Badge, A as AvatarImage, V as Link, l as ue, g as createActor } from "./index-Dq5HxgdE.js";
import { S as Skeleton } from "./index-CUHXBakE.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BnVn6Uwf.js";
import { U as Users } from "./users-BloIa0Op.js";
import { H as Heart } from "./heart-BMd5N4lW.js";
import { T as Trash2 } from "./trash-2-CdAgWrPm.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function isMehulMalhotra(displayName) {
  return (displayName == null ? void 0 : displayName.trim().toLowerCase()) === "mehul malhotra";
}
const ADMIN_CODE = "63372";
const SESSION_KEY = "adminUnlocked";
function AccessDenied() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": "admin.access_denied_page",
      className: "min-h-[80vh] flex items-center justify-center px-4",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "w-full max-w-sm p-8 flex flex-col items-center gap-6 border-border shadow-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-7 w-7 text-destructive" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Access Denied" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This area is restricted to authorised administrators only." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": "admin.access_denied_home_button",
            variant: "outline",
            className: "w-full",
            onClick: () => navigate({ to: "/home" }),
            children: "Go to Home"
          }
        )
      ] })
    }
  );
}
function AdminGate({ onUnlock }) {
  const [code, setCode] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [shaking, setShaking] = reactExports.useState(false);
  function handleUnlock() {
    if (code === ADMIN_CODE) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onUnlock();
    } else {
      setError("Incorrect code");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": "admin.gate_page",
      className: "min-h-[80vh] flex items-center justify-center px-4",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: `w-full max-w-sm p-8 flex flex-col items-center gap-6 border-border shadow-md ${shaking ? "animate-pulse" : ""}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-7 w-7 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Admin Access" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Enter your admin passcode to continue" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex flex-col gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  "data-ocid": "admin.gate_code_input",
                  type: "password",
                  value: code,
                  onChange: (e) => {
                    setCode(e.target.value);
                    setError("");
                  },
                  onKeyDown: (e) => e.key === "Enter" && handleUnlock(),
                  placeholder: "Enter passcode",
                  autoComplete: "off",
                  className: "w-full px-4 py-3 text-center text-xl tracking-[0.4em] bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground placeholder:tracking-normal"
                }
              ),
              error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "p",
                {
                  "data-ocid": "admin.gate_error",
                  className: "text-sm text-destructive text-center flex items-center justify-center gap-1.5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
                    error
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "admin.gate_unlock_button",
                  className: "w-full btn-primary",
                  onClick: handleUnlock,
                  children: "Unlock"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function PostSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 rounded-full flex-shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 rounded" })
  ] });
}
function UserSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-10 rounded-full flex-shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20 rounded" })
  ] });
}
function AdminPostsTab({ onLogout }) {
  const { actor, isFetching } = useActor(createActor);
  const [posts, setPosts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [loadingMore, setLoadingMore] = reactExports.useState(false);
  const [nextOffset, setNextOffset] = reactExports.useState(void 0);
  const [hasMore, setHasMore] = reactExports.useState(false);
  const [deletingIds, setDeletingIds] = reactExports.useState(/* @__PURE__ */ new Set());
  const fetchPosts = reactExports.useCallback(
    async (offset) => {
      if (!actor) return;
      const page = await actor.getExploreFeed(offset, 20n);
      if (offset === 0n) {
        setPosts(page.items);
      } else {
        setPosts((prev) => [...prev, ...page.items]);
      }
      setNextOffset(page.nextOffset);
      setHasMore(page.nextOffset !== void 0 && page.nextOffset !== null);
    },
    [actor]
  );
  reactExports.useEffect(() => {
    if (!actor || isFetching) return;
    setLoading(true);
    fetchPosts(0n).finally(() => setLoading(false));
  }, [actor, isFetching, fetchPosts]);
  async function loadMore() {
    if (!nextOffset) return;
    setLoadingMore(true);
    await fetchPosts(nextOffset);
    setLoadingMore(false);
  }
  async function handleDelete(postId) {
    if (!actor) return;
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    setDeletingIds((prev) => new Set(prev).add(postId));
    try {
      const ok = await actor.deletePost(postId);
      if (ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        ue.success("Post deleted");
      } else {
        ue.error("Could not delete post");
      }
    } catch {
      ue.error("Error deleting post");
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: loading ? "Loading…" : `${posts.length} posts loaded` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          "data-ocid": "admin.logout_button",
          onClick: onLogout,
          className: "text-destructive border-destructive/30 hover:bg-destructive/10",
          children: "Logout Admin"
        }
      )
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "admin.posts.loading_state", children: ["a", "b", "c", "d", "e"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(PostSkeleton, {}, k)) }) : posts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "admin.posts.empty_state",
        className: "py-16 text-center text-muted-foreground",
        children: "No posts found."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", "data-ocid": "admin.posts.list", children: posts.map((post, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": `admin.posts.item.${i + 1}`,
        className: "flex items-start gap-3 py-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-0.5 truncate", children: [
              post.authorPrincipal.toString().slice(0, 20),
              "…"
            ] }),
            post.caption && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground line-clamp-2", children: post.caption }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-3 w-3" }),
                post.likeCount.toString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3 w-3" }),
                post.commentCount.toString()
              ] }),
              post.photoBlob && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "text-[10px] h-4 px-1.5",
                  children: "Photo"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": `admin.posts.delete_button.${i + 1}`,
              variant: "ghost",
              size: "icon",
              className: "text-destructive hover:bg-destructive/10 hover:text-destructive flex-shrink-0",
              disabled: deletingIds.has(post.id),
              onClick: () => handleDelete(post.id),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ]
      },
      post.id.toString()
    )) }),
    hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        "data-ocid": "admin.posts.load_more_button",
        variant: "outline",
        size: "sm",
        onClick: loadMore,
        disabled: loadingMore,
        children: loadingMore ? "Loading…" : "Load more"
      }
    ) })
  ] });
}
function AdminUsersTab() {
  const { actor, isFetching } = useActor(createActor);
  const [users, setUsers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [loadingMore, setLoadingMore] = reactExports.useState(false);
  const [nextOffset, setNextOffset] = reactExports.useState(void 0);
  const [hasMore, setHasMore] = reactExports.useState(false);
  const fetchUsers = reactExports.useCallback(
    async (offset) => {
      if (!actor) return;
      const page = await actor.searchUsers("", offset, 20n);
      if (offset === 0n) {
        setUsers(page.items);
      } else {
        setUsers((prev) => [...prev, ...page.items]);
      }
      setNextOffset(page.nextOffset);
      setHasMore(page.nextOffset !== void 0 && page.nextOffset !== null);
    },
    [actor]
  );
  reactExports.useEffect(() => {
    if (!actor || isFetching) return;
    setLoading(true);
    fetchUsers(0n).finally(() => setLoading(false));
  }, [actor, isFetching, fetchUsers]);
  async function loadMore() {
    if (!nextOffset) return;
    setLoadingMore(true);
    await fetchUsers(nextOffset);
    setLoadingMore(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: loading ? "Loading…" : `${users.length} users loaded` }) }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "admin.users.loading_state", children: ["a", "b", "c", "d", "e"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(UserSkeleton, {}, k)) }) : users.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "admin.users.empty_state",
        className: "py-16 text-center text-muted-foreground",
        children: "No users found."
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", "data-ocid": "admin.users.list", children: users.map((user, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": `admin.users.item.${i + 1}`,
        className: "flex items-center gap-3 py-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AvatarImage,
            {
              blob: user.avatarBlob,
              displayName: user.displayName,
              username: user.username,
              size: "sm"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: user.displayName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
              "@",
              user.username,
              " ·",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                user.followerCount.toString(),
                " followers"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/profile/$username",
              params: { username: user.username },
              "data-ocid": `admin.users.view_link.${i + 1}`,
              className: "text-xs text-primary hover:underline flex-shrink-0",
              children: "View"
            }
          )
        ]
      },
      user.principal.toString()
    )) }),
    hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        "data-ocid": "admin.users.load_more_button",
        variant: "outline",
        size: "sm",
        onClick: loadMore,
        disabled: loadingMore,
        children: loadingMore ? "Loading…" : "Load more"
      }
    ) })
  ] });
}
function AdminDashboard({ onLogout }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "admin.dashboard_page",
      className: "max-w-3xl mx-auto px-4 py-8",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Admin Panel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage posts and users" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "posts", "data-ocid": "admin.tabs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-6 w-full sm:w-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              TabsTrigger,
              {
                value: "posts",
                "data-ocid": "admin.posts_tab",
                className: "flex-1 sm:flex-none gap-2",
                children: "Posts"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "users",
                "data-ocid": "admin.users_tab",
                className: "flex-1 sm:flex-none gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4" }),
                  "Users"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "posts", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminPostsTab, { onLogout }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "users", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AdminUsersTab, {}) })
        ] })
      ]
    }
  );
}
function AdminPage() {
  const { profile, isInitializing } = useAuth();
  const [unlocked, setUnlocked] = reactExports.useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1"
  );
  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
  }
  if (isInitializing) return null;
  if (!isMehulMalhotra(profile == null ? void 0 : profile.displayName)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AccessDenied, {});
  }
  if (!unlocked) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminGate, { onUnlock: () => setUnlocked(true) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AdminDashboard, { onLogout: handleLogout });
}
export {
  AdminPage as default
};
