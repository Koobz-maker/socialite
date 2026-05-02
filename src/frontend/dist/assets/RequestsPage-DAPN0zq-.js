import { n as createLucideIcon, u as useAuth, c as useNavigate, a as useActor, b as useQueryClient, r as reactExports, d as useQuery, F as FollowRequestStatus, j as jsxRuntimeExports, x as Badge, e as useMutation, l as ue, A as AvatarImage, B as Button, g as createActor } from "./index-Dq5HxgdE.js";
import { S as Skeleton } from "./index-CUHXBakE.js";
import { U as Users } from "./users-BloIa0Op.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserMinus = createLucideIcon("user-minus", __iconNode);
function RequestItemSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-11 h-11 rounded-full flex-shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-48" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20 rounded-md" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20 rounded-md" })
    ] })
  ] });
}
function RequestItem({
  request,
  index,
  onAction
}) {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const fromPrincipal = request.from.toString();
  const { data: profile } = useQuery({
    queryKey: ["profile", fromPrincipal],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(request.from);
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
  const approveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.approveFollowRequest(request.from);
    },
    onSuccess: () => {
      ue.success(`Approved ${(profile == null ? void 0 : profile.displayName) ?? "request"}`);
      queryClient.invalidateQueries({ queryKey: ["myFollowRequests"] });
      queryClient.invalidateQueries({ queryKey: ["pendingRequestCount"] });
      onAction();
    },
    onError: () => ue.error("Failed to approve request")
  });
  const declineMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.declineFollowRequest(request.from);
    },
    onSuccess: () => {
      ue.success("Request declined");
      queryClient.invalidateQueries({ queryKey: ["myFollowRequests"] });
      queryClient.invalidateQueries({ queryKey: ["pendingRequestCount"] });
      onAction();
    },
    onError: () => ue.error("Failed to decline request")
  });
  const isPending = approveMutation.isPending || declineMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `requests.item.${index + 1}`,
      className: "flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "flex-shrink-0",
            onClick: () => profile && navigate({ to: `/profile/${profile.username}` }),
            "aria-label": `View ${(profile == null ? void 0 : profile.displayName) ?? "user"}'s profile`,
            children: profile ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              AvatarImage,
              {
                blob: profile.avatarBlob,
                displayName: profile.displayName,
                username: profile.username,
                size: "sm",
                className: "!w-11 !h-11"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-11 h-11 rounded-full" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: profile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "text-sm font-semibold text-foreground truncate leading-tight text-left hover:underline",
              onClick: () => navigate({ to: `/profile/${profile.username}` }),
              children: profile.displayName
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
            "@",
            profile.username
          ] }),
          profile.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: profile.bio })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": `requests.approve_button.${index + 1}`,
              size: "sm",
              disabled: isPending,
              onClick: () => approveMutation.mutate(),
              className: "gap-1.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-3.5 w-3.5" }),
                "Approve"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": `requests.decline_button.${index + 1}`,
              size: "sm",
              variant: "outline",
              disabled: isPending,
              onClick: () => declineMutation.mutate(),
              className: "gap-1.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { className: "h-3.5 w-3.5" }),
                "Decline"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function RequestsPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  reactExports.useEffect(() => {
    if (!isInitializing && !isAuthenticated) navigate({ to: "/" });
  }, [isAuthenticated, isInitializing, navigate]);
  const { data: requests, isLoading } = useQuery({
    queryKey: ["myFollowRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyFollowRequests();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 15e3
  });
  const pending = (requests ?? []).filter(
    (r) => r.status === FollowRequestStatus.pending
  );
  const handleAction = () => {
    queryClient.invalidateQueries({ queryKey: ["myFollowRequests"] });
  };
  if (!isAuthenticated && !isInitializing) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "requests.page", className: "max-w-2xl mx-auto pb-24 md:pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-6 pb-4 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-6 w-6 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Follow Requests" }),
        pending.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "ml-auto", children: pending.length })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "People who want to follow you" })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "requests.loading_state",
        className: "divide-y divide-border",
        children: [1, 2, 3].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(RequestItemSkeleton, {}, k))
      }
    ) : pending.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "requests.empty_state",
        className: "flex flex-col items-center py-20 px-4 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-14 w-14 text-muted-foreground/40 mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-1", children: "All caught up!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No pending follow requests right now." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "requests.list", className: "divide-y divide-border", children: pending.map((req, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      RequestItem,
      {
        request: req,
        index: i,
        onAction: handleAction
      },
      req.id.toString()
    )) })
  ] });
}
export {
  RequestsPage as default
};
