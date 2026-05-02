const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-CUHXBakE.js","assets/index-Dq5HxgdE.js","assets/index-CiV1uXCF.css"])))=>i.map(i=>d[i]);
import { n as createLucideIcon, r as reactExports, j as jsxRuntimeExports, Y as createSlot, i as cn, u as useAuth, c as useNavigate, a as useActor, d as useQuery, A as AvatarImage, B as Button, b as useQueryClient, e as useMutation, l as ue, Z as ExternalBlob, T as Textarea, M as MessageCircle, g as createActor, _ as __vitePreload } from "./index-Dq5HxgdE.js";
import { I as Input } from "./input-BNCGTdes.js";
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
  [
    "path",
    {
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
];
const Camera = createLucideIcon("camera", __iconNode);
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
var NAME = "Label";
var Label$1 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        var _a;
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        (_a = props.onMouseDown) == null ? void 0 : _a.call(props, event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$1.displayName = NAME;
var Root = Label$1;
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
const THUMB_COLORS = [
  "bg-primary/20",
  "bg-accent/20",
  "bg-secondary",
  "bg-muted",
  "bg-primary/10",
  "bg-accent/10"
];
function PostThumbnail({ post, index }) {
  const navigate = useNavigate();
  const colorClass = THUMB_COLORS[index % THUMB_COLORS.length];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": `my_profile.post_thumb.${index + 1}`,
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `my_profile.user_item.${index + 1}`,
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
        showChat && profile && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            "data-ocid": `my_profile.chat_button.${index + 1}`,
            size: "icon",
            variant: "ghost",
            className: "flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-primary",
            "aria-label": `Message ${profile.displayName}`,
            onClick: () => navigate({ to: `/chat/${profile.username}` }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-4 w-4" })
          }
        )
      ]
    }
  );
}
function EditForm({ profile, onSaved, onCancel }) {
  const { actor } = useActor(createActor);
  const { refetchProfile } = useAuth();
  const queryClient = useQueryClient();
  const avatarFileRef = reactExports.useRef(null);
  const [avatarPreview, setAvatarPreview] = reactExports.useState(null);
  const [displayName, setDisplayName] = reactExports.useState((profile == null ? void 0 : profile.displayName) ?? "");
  const [username, setUsername] = reactExports.useState((profile == null ? void 0 : profile.username) ?? "");
  const [bio, setBio] = reactExports.useState((profile == null ? void 0 : profile.bio) ?? "");
  const avatarInputRef = reactExports.useRef(null);
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      let avatarBlob;
      if (avatarFileRef.current) {
        const bytes = new Uint8Array(await avatarFileRef.current.arrayBuffer());
        avatarBlob = ExternalBlob.fromBytes(bytes);
      }
      const updated = {
        displayName,
        username,
        bio,
        avatarBlob: avatarBlob ?? (profile == null ? void 0 : profile.avatarBlob)
      };
      await actor.saveCallerUserProfile(updated);
    },
    onSuccess: async () => {
      await refetchProfile();
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      queryClient.invalidateQueries({ queryKey: ["myFullProfile"] });
      ue.success("Profile saved!");
      onSaved();
    },
    onError: () => {
      ue.error("Failed to save profile. Please try again.");
    }
  });
  const handleAvatarChange = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    avatarFileRef.current = file;
    setAvatarPreview(URL.createObjectURL(file));
  };
  const previewBlob = avatarPreview ? ExternalBlob.fromURL(avatarPreview) : profile == null ? void 0 : profile.avatarBlob;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AvatarImage,
          {
            blob: previewBlob,
            displayName: displayName || (profile == null ? void 0 : profile.displayName),
            username: username || (profile == null ? void 0 : profile.username),
            size: "xl",
            className: "!w-20 !h-20 !text-xl"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "data-ocid": "my_profile.avatar_upload_button",
            className: "absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-sm hover:opacity-90 transition-smooth",
            onClick: () => {
              var _a;
              return (_a = avatarInputRef.current) == null ? void 0 : _a.click();
            },
            "aria-label": "Change avatar",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-3.5 w-3.5 text-primary-foreground" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: avatarInputRef,
            type: "file",
            accept: "image/*",
            className: "hidden",
            onChange: handleAvatarChange
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "Profile photo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Click the camera to update" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1.5 block", children: "Display name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          "data-ocid": "my_profile.display_name_input",
          value: displayName,
          onChange: (e) => setDisplayName(e.target.value),
          className: "h-9 text-sm",
          maxLength: 50,
          placeholder: "Your name"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1.5 block", children: "Username" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none", children: "@" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "my_profile.username_input",
            value: username,
            onChange: (e) => setUsername(e.target.value.replace(/\s/g, "")),
            className: "h-9 text-sm pl-7",
            maxLength: 30,
            placeholder: "username"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground mb-1.5 block", children: "Bio" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          "data-ocid": "my_profile.bio_input",
          value: bio,
          onChange: (e) => setBio(e.target.value),
          className: "text-sm resize-none",
          rows: 3,
          maxLength: 160,
          placeholder: "Tell people a bit about yourself"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1 text-right", children: [
        bio.length,
        "/160"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          "data-ocid": "my_profile.save_button",
          size: "sm",
          disabled: saveMutation.isPending || !displayName.trim() || !username.trim(),
          onClick: () => saveMutation.mutate(),
          children: saveMutation.isPending ? "Saving…" : "Save changes"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          "data-ocid": "my_profile.cancel_button",
          size: "sm",
          variant: "outline",
          onClick: onCancel,
          disabled: saveMutation.isPending,
          children: "Cancel"
        }
      )
    ] })
  ] });
}
function MyProfilePage() {
  const { isAuthenticated, isInitializing, principal } = useAuth();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const [editing, setEditing] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, isInitializing, navigate]);
  const { data: profile } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: fullProfile } = useQuery({
    queryKey: ["myFullProfile", principal],
    queryFn: async () => {
      if (!actor || !principal) return null;
      const { Principal } = await __vitePreload(async () => {
        const { Principal: Principal2 } = await import("./index-CUHXBakE.js").then((n) => n.i);
        return { Principal: Principal2 };
      }, true ? __vite__mapDeps([0,1,2]) : void 0);
      return actor.getProfile(Principal.fromText(principal));
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principal,
    staleTime: 3e4
  });
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["myPosts", principal],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const { Principal } = await __vitePreload(async () => {
        const { Principal: Principal2 } = await import("./index-CUHXBakE.js").then((n) => n.i);
        return { Principal: Principal2 };
      }, true ? __vite__mapDeps([0,1,2]) : void 0);
      const page = await actor.listPostsByAuthor(
        Principal.fromText(principal),
        0n,
        60n
      );
      return page.items;
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principal,
    staleTime: 3e4
  });
  const { data: followerPrincipals } = useQuery({
    queryKey: ["myFollowers", principal],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const { Principal } = await __vitePreload(async () => {
        const { Principal: Principal2 } = await import("./index-CUHXBakE.js").then((n) => n.i);
        return { Principal: Principal2 };
      }, true ? __vite__mapDeps([0,1,2]) : void 0);
      const page = await actor.getFollowers(
        Principal.fromText(principal),
        0n,
        50n
      );
      return page.items.map((p) => p.toString());
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principal,
    staleTime: 3e4
  });
  const { data: followingPrincipals } = useQuery({
    queryKey: ["myFollowing", principal],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const { Principal } = await __vitePreload(async () => {
        const { Principal: Principal2 } = await import("./index-CUHXBakE.js").then((n) => n.i);
        return { Principal: Principal2 };
      }, true ? __vite__mapDeps([0,1,2]) : void 0);
      const page = await actor.getFollowing(
        Principal.fromText(principal),
        0n,
        50n
      );
      return page.items.map((p) => p.toString());
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principal,
    staleTime: 3e4
  });
  if (!isAuthenticated && !isInitializing) return null;
  const followerList = followerPrincipals ?? [];
  const followingList = followingPrincipals ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "my_profile.page",
      className: "max-w-2xl mx-auto pb-24 md:pb-6",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-6 pb-5", children: editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EditForm,
          {
            profile: profile ?? null,
            onSaved: () => setEditing(false),
            onCancel: () => setEditing(false)
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AvatarImage,
            {
              blob: profile == null ? void 0 : profile.avatarBlob,
              displayName: profile == null ? void 0 : profile.displayName,
              username: profile == null ? void 0 : profile.username,
              size: "xl",
              className: "!w-24 !h-24 !text-2xl flex-shrink-0"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 pt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground truncate leading-tight", children: (profile == null ? void 0 : profile.displayName) || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Your Name" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  "@",
                  (profile == null ? void 0 : profile.username) || "username"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "my_profile.edit_button",
                  size: "sm",
                  variant: "outline",
                  onClick: () => setEditing(true),
                  className: "flex-shrink-0",
                  children: "Edit profile"
                }
              )
            ] }),
            (profile == null ? void 0 : profile.bio) ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed mt-2 mb-3", children: profile.bio }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic mt-2 mb-3", children: "No bio yet — add one to tell people about yourself." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-5 mt-3 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
                Number((fullProfile == null ? void 0 : fullProfile.postCount) ?? 0n),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-muted-foreground ml-1", children: "posts" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
                Number((fullProfile == null ? void 0 : fullProfile.followerCount) ?? 0n),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-muted-foreground ml-1", children: "followers" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
                Number((fullProfile == null ? void 0 : fullProfile.followingCount) ?? 0n),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-muted-foreground ml-1", children: "following" })
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "posts", "data-ocid": "my_profile.tabs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "w-full rounded-none border-b border-border bg-transparent h-11 gap-0 px-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                "data-ocid": "my_profile.posts_tab",
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
                "data-ocid": "my_profile.followers_tab",
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
                "data-ocid": "my_profile.following_tab",
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
              "data-ocid": "my_profile.posts_loading_state",
              className: "grid grid-cols-3 gap-0.5 p-0.5",
              children: ["a", "b", "c", "d", "e", "f", "g", "h", "i"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Skeleton,
                {
                  className: "aspect-square w-full rounded-none"
                },
                k
              ))
            }
          ) : !posts || posts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "my_profile.posts_empty_state",
              className: "flex flex-col items-center py-16 px-4 text-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ImageOff, { className: "h-12 w-12 text-muted-foreground/50 mb-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground mb-1", children: "No posts yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Share your first photo or thought with the world." }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "my_profile.create_post_button",
                    size: "sm",
                    onClick: () => navigate({ to: "/home" }),
                    children: "Create post"
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "my_profile.posts_grid",
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
                  "data-ocid": "my_profile.followers_empty_state",
                  className: "flex flex-col items-center py-16 px-4 text-center",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-12 w-12 text-muted-foreground/50 mb-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground mb-1", children: "No followers yet" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Keep posting and people will start following you." })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-ocid": "my_profile.followers_list",
                  className: "divide-y divide-border",
                  children: followerList.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    UserListItem,
                    {
                      principal: p,
                      index: i,
                      showChat: false
                    },
                    p
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
                  "data-ocid": "my_profile.following_empty_state",
                  className: "flex flex-col items-center py-16 px-4 text-center",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-12 w-12 text-muted-foreground/50 mb-4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground mb-1", children: "You're not following anyone" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Discover and follow people to see their posts in your feed." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        "data-ocid": "my_profile.explore_button",
                        size: "sm",
                        variant: "outline",
                        onClick: () => navigate({ to: "/explore" }),
                        children: "Explore people"
                      }
                    )
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-ocid": "my_profile.following_list",
                  className: "divide-y divide-border",
                  children: followingList.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(UserListItem, { principal: p, index: i, showChat: true }, p))
                }
              )
            }
          )
        ] })
      ]
    }
  );
}
export {
  MyProfilePage as default
};
