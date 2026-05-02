import { u as useAuth, c as useNavigate, a as useActor, h as useNotifications, r as reactExports, j as jsxRuntimeExports, B as Button, i as cn, k as Bell, f as formatDistanceToNow, N as NotificationType, l as ue, U as UserPlus, M as MessageCircle, g as createActor } from "./index-Dq5HxgdE.js";
import { S as Skeleton } from "./index-CUHXBakE.js";
import { H as Heart } from "./heart-BMd5N4lW.js";
const PAGE_SIZE = 20;
const TABS = [
  { id: "all", label: "All" },
  { id: "likes", label: "Likes" },
  { id: "comments", label: "Comments" },
  { id: "follows", label: "Follows" }
];
function notifIcon(type) {
  switch (type) {
    case NotificationType.like:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4 text-destructive", "aria-hidden": "true" });
    case NotificationType.comment:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4 text-accent", "aria-hidden": "true" });
    case NotificationType.newFollower:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 text-primary", "aria-hidden": "true" });
  }
}
function notifText(n) {
  const from = `@${n.fromPrincipal.toString().slice(0, 8)}…`;
  switch (n.notifType) {
    case NotificationType.like:
      return `${from} liked your post`;
    case NotificationType.comment:
      return `${from} commented on your post`;
    case NotificationType.newFollower:
      return `${from} started following you`;
  }
}
function filterNotifications(notifications, tab) {
  if (tab === "all") return notifications;
  if (tab === "likes")
    return notifications.filter((n) => n.notifType === NotificationType.like);
  if (tab === "comments")
    return notifications.filter(
      (n) => n.notifType === NotificationType.comment
    );
  if (tab === "follows")
    return notifications.filter(
      (n) => n.notifType === NotificationType.newFollower
    );
  return notifications;
}
const SKELETON_KEYS = ["a", "b", "c", "d", "e", "f"];
function NotificationSkeleton({ id }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 px-4 py-3.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-9 h-9 rounded-full flex-shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/4" })
    ] })
  ] }, id);
}
function NotificationsPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const { notifications, unreadCount, isLoading, markRead, markAllRead } = useNotifications(200);
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  reactExports.useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, isInitializing, navigate]);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };
  const filtered = reactExports.useMemo(
    () => filterNotifications(notifications, activeTab),
    [notifications, activeTab]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const handleNotifClick = async (n) => {
    markRead(n.id);
    if ((n.notifType === NotificationType.like || n.notifType === NotificationType.comment) && n.postId !== void 0) {
      navigate({
        to: "/post/$postId",
        params: { postId: n.postId.toString() }
      });
    } else if (n.notifType === NotificationType.newFollower) {
      try {
        const profile = actor ? await actor.getUserProfile(n.fromPrincipal) : null;
        if (profile == null ? void 0 : profile.username) {
          navigate({
            to: "/profile/$username",
            params: { username: profile.username }
          });
        } else {
          ue.info("Could not resolve follower profile.");
        }
      } catch {
        ue.info("Could not resolve follower profile.");
      }
    }
  };
  if (!isAuthenticated && !isInitializing) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "notifications.page",
      className: "max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-10",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Notifications" }),
          unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              "data-ocid": "notifications.mark_all_read_button",
              variant: "ghost",
              size: "sm",
              onClick: markAllRead,
              className: "text-primary text-sm font-medium hover:text-primary/80",
              children: "Mark all read"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "notifications.filter_tabs",
            className: "flex items-center gap-1 mb-5 bg-muted p-1 rounded-lg",
            children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `notifications.filter.${tab.id}`,
                onClick: () => handleTabChange(tab.id),
                className: cn(
                  "flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-smooth",
                  activeTab === tab.id ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                ),
                children: tab.label
              },
              tab.id
            ))
          }
        ),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "notifications.loading_state", className: "space-y-1", children: SKELETON_KEYS.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationSkeleton, { id: k }, k)) }) : paginated.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "notifications.empty_state",
            className: "flex flex-col items-center justify-center py-20 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Bell,
                {
                  className: "h-8 w-8 text-muted-foreground",
                  "aria-hidden": "true"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground mb-2", children: activeTab === "all" ? "No notifications yet" : `No ${activeTab} yet` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: activeTab === "all" ? "Engage with others to start seeing activity here." : `You'll see ${activeTab} notifications here when they arrive.` })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { "data-ocid": "notifications.list", className: "space-y-0.5", children: paginated.map((n, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              "data-ocid": `notifications.item.${(currentPage - 1) * PAGE_SIZE + i + 1}`,
              className: cn(
                "w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-lg transition-smooth hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !n.read && "bg-primary/5"
              ),
              onClick: () => handleNotifClick(n),
              "aria-label": notifText(n),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-9 h-9 rounded-full bg-muted flex items-center justify-center mt-0.5", children: notifIcon(n.notifType) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: cn(
                        "text-sm leading-snug break-words",
                        !n.read ? "font-semibold text-foreground" : "text-foreground/80"
                      ),
                      children: notifText(n)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: formatDistanceToNow(
                    new Date(Number(n.createdAt / 1000000n)),
                    { addSuffix: true }
                  ) })
                ] }),
                !n.read && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5",
                    "aria-label": "Unread"
                  }
                )
              ]
            }
          ) }, n.id.toString())) }),
          totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "notifications.pagination",
              className: "flex items-center justify-between mt-6 pt-4 border-t border-border",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "notifications.pagination_prev",
                    variant: "outline",
                    size: "sm",
                    disabled: currentPage === 1,
                    onClick: () => setCurrentPage((p) => p - 1),
                    children: "Previous"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
                  "Page ",
                  currentPage,
                  " of ",
                  totalPages
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "notifications.pagination_next",
                    variant: "outline",
                    size: "sm",
                    disabled: currentPage === totalPages,
                    onClick: () => setCurrentPage((p) => p + 1),
                    children: "Next"
                  }
                )
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  NotificationsPage as default
};
