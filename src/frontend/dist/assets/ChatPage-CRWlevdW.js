const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-CUHXBakE.js","assets/index-Dq5HxgdE.js","assets/index-CiV1uXCF.css"])))=>i.map(i=>d[i]);
import { n as createLucideIcon, u as useAuth, c as useNavigate, a as useActor, r as reactExports, d as useQuery, j as jsxRuntimeExports, M as MessageCircle, B as Button, S as SquarePen, f as formatDistanceToNow, A as AvatarImage, x as Badge, D as Dialog, y as DialogContent, z as DialogHeader, C as DialogTitle, g as createActor, _ as __vitePreload } from "./index-Dq5HxgdE.js";
import { S as Skeleton } from "./index-CUHXBakE.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }],
  ["path", { d: "M12 7v6", key: "lw1j43" }],
  ["path", { d: "M9 10h6", key: "9gxzsh" }]
];
const MessageSquarePlus = createLucideIcon("message-square-plus", __iconNode);
function ConversationSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-12 h-12 rounded-full flex-shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-48" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-12" })
  ] });
}
function ConversationItem({
  conversation,
  index
}) {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const partnerPrincipal = conversation.partner.toString();
  const { data: profile } = useQuery({
    queryKey: ["profile", partnerPrincipal],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(conversation.partner);
    },
    enabled: !!actor && !isFetching,
    staleTime: 6e4
  });
  const unread = Number(conversation.unreadCount);
  const timeAgo = formatDistanceToNow(
    new Date(Number(conversation.lastMessage.createdAt / 1000000n)),
    { addSuffix: true }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": `chat.conversation_item.${index + 1}`,
      className: "w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left cursor-pointer",
      onClick: () => profile && navigate({ to: `/chat/${profile.username}` }),
      children: [
        profile ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          AvatarImage,
          {
            blob: profile.avatarBlob,
            displayName: profile.displayName,
            username: profile.username,
            size: "md",
            className: "!w-12 !h-12 flex-shrink-0"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-12 h-12 rounded-full flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-sm truncate ${unread > 0 ? "font-bold text-foreground" : "font-medium text-foreground"}`,
                children: (profile == null ? void 0 : profile.displayName) ?? "…"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground flex-shrink-0", children: timeAgo })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-sm truncate flex-1 line-clamp-1 ${unread > 0 ? "font-medium text-foreground" : "text-muted-foreground"}`,
                children: conversation.lastMessage.text
              }
            ),
            unread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "destructive",
                className: "h-5 min-w-5 px-1.5 text-[11px] leading-none flex-shrink-0 rounded-full",
                children: unread > 99 ? "99+" : unread
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function ContactItem({
  profile,
  onSelect
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AvatarImage,
      {
        blob: profile.avatarBlob,
        displayName: profile.displayName,
        username: profile.username,
        size: "md",
        className: "!w-10 !h-10 flex-shrink-0"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate leading-tight", children: profile.displayName }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
        "@",
        profile.username
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        "data-ocid": `chat.new_chat_message_button.${profile.username}`,
        size: "sm",
        variant: "outline",
        className: "flex-shrink-0 gap-1.5",
        onClick: () => onSelect(profile.username),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3.5 w-3.5" }),
          "Message"
        ]
      }
    )
  ] });
}
function NewChatModal({
  open,
  onClose
}) {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const { principal } = useAuth();
  const { data: contacts, isLoading } = useQuery({
    queryKey: ["messageable-contacts", principal],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const { Principal: P } = await __vitePreload(async () => {
        const { Principal: P2 } = await import("./index-CUHXBakE.js").then((n) => n.i);
        return { Principal: P2 };
      }, true ? __vite__mapDeps([0,1,2]) : void 0);
      const myPrincipal = P.fromText(principal);
      const [followingPage, followerPage] = await Promise.all([
        actor.getFollowingProfiles(myPrincipal, 0n, 100n),
        actor.getFollowerProfiles(myPrincipal, 0n, 100n)
      ]);
      const seen = /* @__PURE__ */ new Map();
      for (const p of [...followingPage.items, ...followerPage.items]) {
        seen.set(p.principal.toString(), p);
      }
      return Array.from(seen.values());
    },
    enabled: open && !!actor && !isFetching && !!principal,
    staleTime: 3e4
  });
  const handleSelect = (username) => {
    onClose();
    navigate({ to: `/chat/${username}` });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      "data-ocid": "chat.new_chat_dialog",
      className: "max-w-md p-0 overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "px-4 pt-5 pb-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-base font-semibold", children: "New Message" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[60vh] overflow-y-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: [1, 2, 3, 4].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-full flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-32" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20" })
        ] }, k)) }) : !contacts || contacts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": "chat.new_chat_empty_state",
            className: "py-12 px-4 text-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No connections yet. Follow someone to start chatting." })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: contacts.map((profile) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ContactItem,
          {
            profile,
            onSelect: handleSelect
          },
          profile.principal.toString()
        )) }) })
      ]
    }
  ) });
}
function EmptyStateWithContacts() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const { principal } = useAuth();
  const { data: contacts, isLoading } = useQuery({
    queryKey: ["messageable-contacts", principal],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const { Principal: P } = await __vitePreload(async () => {
        const { Principal: P2 } = await import("./index-CUHXBakE.js").then((n) => n.i);
        return { Principal: P2 };
      }, true ? __vite__mapDeps([0,1,2]) : void 0);
      const myPrincipal = P.fromText(principal);
      const [followingPage, followerPage] = await Promise.all([
        actor.getFollowingProfiles(myPrincipal, 0n, 100n),
        actor.getFollowerProfiles(myPrincipal, 0n, 100n)
      ]);
      const seen = /* @__PURE__ */ new Map();
      for (const p of [...followingPage.items, ...followerPage.items]) {
        seen.set(p.principal.toString(), p);
      }
      return Array.from(seen.values());
    },
    enabled: !!actor && !isFetching && !!principal,
    staleTime: 3e4
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "chat.loading_state", className: "divide-y divide-border", children: [1, 2, 3, 4].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(ConversationSkeleton, {}, k)) });
  }
  if (!contacts || contacts.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "chat.empty_state",
        className: "flex flex-col items-center py-20 px-4 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquarePlus, { className: "h-14 w-14 text-muted-foreground/40 mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-1", children: "No messages yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Follow someone and they'll appear here when you're ready to chat." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "chat.empty_state", className: "px-4 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-0", children: "Start a conversation" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border rounded-lg border border-border overflow-hidden", children: contacts.map((profile) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AvatarImage,
            {
              blob: profile.avatarBlob,
              displayName: profile.displayName,
              username: profile.username,
              size: "md",
              className: "!w-10 !h-10 flex-shrink-0"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate leading-tight", children: profile.displayName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
              "@",
              profile.username
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": `chat.start_chat_button.${profile.username}`,
              size: "sm",
              variant: "outline",
              className: "flex-shrink-0 gap-1.5",
              onClick: () => navigate({ to: `/chat/${profile.username}` }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3.5 w-3.5" }),
                "Message"
              ]
            }
          )
        ]
      },
      profile.principal.toString()
    )) })
  ] });
}
function ChatPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const [newChatOpen, setNewChatOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!isInitializing && !isAuthenticated) navigate({ to: "/" });
  }, [isAuthenticated, isInitializing, navigate]);
  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listConversations();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    refetchInterval: 3e3,
    staleTime: 2e3
  });
  if (!isAuthenticated && !isInitializing) return null;
  const hasConversations = conversations && conversations.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "chat.page", className: "max-w-2xl mx-auto pb-24 md:pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-6 pb-4 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-6 w-6 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Messages" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "chat.new_chat_button",
            size: "sm",
            variant: "outline",
            className: "gap-1.5",
            onClick: () => setNewChatOpen(true),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-4 w-4" }),
              "New Chat"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Direct messages with your connections" })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "chat.loading_state", className: "divide-y divide-border", children: [1, 2, 3, 4].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(ConversationSkeleton, {}, k)) }) : hasConversations ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "chat.conversations_list",
        className: "divide-y divide-border",
        children: conversations.map((conv, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ConversationItem,
          {
            conversation: conv,
            index: i
          },
          conv.partner.toString()
        ))
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyStateWithContacts, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NewChatModal, { open: newChatOpen, onClose: () => setNewChatOpen(false) })
  ] });
}
export {
  ChatPage as default
};
