import { createActor } from "@/backend";
import type { UserProfile } from "@/backend";
import { ExternalBlob } from "@/backend";
import type { Profile } from "@/backend";
import { AvatarImage } from "@/components/AvatarImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import type { Post } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Camera, Grid3X3, ImageOff, MessageCircle, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Post Thumbnail ───────────────────────────────────────────────────────────

const THUMB_COLORS = [
  "bg-primary/20",
  "bg-accent/20",
  "bg-secondary",
  "bg-muted",
  "bg-primary/10",
  "bg-accent/10",
];

function PostThumbnail({ post, index }: { post: Post; index: number }) {
  const navigate = useNavigate();
  const colorClass = THUMB_COLORS[index % THUMB_COLORS.length];

  return (
    <button
      type="button"
      data-ocid={`my_profile.post_thumb.${index + 1}`}
      className="aspect-square w-full overflow-hidden rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none group relative"
      onClick={() => navigate({ to: `/post/${post.id}` })}
      aria-label={`View post: ${post.caption.slice(0, 40)}`}
    >
      {post.photoBlob ? (
        <img
          src={post.photoBlob.getDirectURL()}
          alt={post.caption || "Post photo"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center p-2 ${colorClass}`}
        >
          <p className="text-xs text-foreground/80 text-center line-clamp-4 leading-relaxed font-body">
            {post.caption}
          </p>
        </div>
      )}
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-200" />
    </button>
  );
}

// ─── User List Item ───────────────────────────────────────────────────────────

function UserListItem({
  principal,
  index,
  showChat,
}: { principal: string; index: number; showChat?: boolean }) {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);

  const { data: profile } = useQuery<Profile | null>({
    queryKey: ["profile", principal],
    queryFn: async () => {
      if (!actor) return null;
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.getUserProfile(Principal.fromText(principal));
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  return (
    <div
      data-ocid={`my_profile.user_item.${index + 1}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
    >
      <button
        type="button"
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
        onClick={() =>
          profile && navigate({ to: `/profile/${profile.username}` })
        }
        aria-label={`View ${profile?.displayName ?? "user"}'s profile`}
      >
        {profile ? (
          <AvatarImage
            blob={profile.avatarBlob}
            displayName={profile.displayName}
            username={profile.username}
            size="sm"
          />
        ) : (
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
        )}
        <div className="min-w-0">
          {profile ? (
            <>
              <p className="text-sm font-semibold text-foreground truncate leading-tight">
                {profile.displayName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                @{profile.username}
              </p>
            </>
          ) : (
            <div className="space-y-1">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          )}
        </div>
      </button>
      {showChat && profile && (
        <Button
          data-ocid={`my_profile.chat_button.${index + 1}`}
          size="icon"
          variant="ghost"
          className="flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-primary"
          aria-label={`Message ${profile.displayName}`}
          onClick={() => navigate({ to: `/chat/${profile.username}` })}
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// ─── Edit Form ────────────────────────────────────────────────────────────────

interface EditFormProps {
  profile: UserProfile | null;
  onSaved: () => void;
  onCancel: () => void;
}

function EditForm({ profile, onSaved, onCancel }: EditFormProps) {
  const { actor } = useActor(createActor);
  const { refetchProfile } = useAuth();
  const queryClient = useQueryClient();
  const avatarFileRef = useRef<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      let avatarBlob: ExternalBlob | undefined;
      if (avatarFileRef.current) {
        const bytes = new Uint8Array(await avatarFileRef.current.arrayBuffer());
        avatarBlob = ExternalBlob.fromBytes(bytes);
      }
      const updated: UserProfile = {
        displayName,
        username,
        bio,
        avatarBlob: avatarBlob ?? profile?.avatarBlob,
      };
      await actor.saveCallerUserProfile(updated);
    },
    onSuccess: async () => {
      await refetchProfile();
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
      queryClient.invalidateQueries({ queryKey: ["myFullProfile"] });
      toast.success("Profile saved!");
      onSaved();
    },
    onError: () => {
      toast.error("Failed to save profile. Please try again.");
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    avatarFileRef.current = file;
    setAvatarPreview(URL.createObjectURL(file));
  };

  const previewBlob = avatarPreview
    ? ExternalBlob.fromURL(avatarPreview)
    : profile?.avatarBlob;

  return (
    <div className="space-y-4">
      {/* Avatar editor */}
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <AvatarImage
            blob={previewBlob}
            displayName={displayName || profile?.displayName}
            username={username || profile?.username}
            size="xl"
            className="!w-20 !h-20 !text-xl"
          />
          <button
            type="button"
            data-ocid="my_profile.avatar_upload_button"
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-sm hover:opacity-90 transition-smooth"
            onClick={() => avatarInputRef.current?.click()}
            aria-label="Change avatar"
          >
            <Camera className="h-3.5 w-3.5 text-primary-foreground" />
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Profile photo</p>
          <p>Click the camera to update</p>
        </div>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">
          Display name
        </Label>
        <Input
          data-ocid="my_profile.display_name_input"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="h-9 text-sm"
          maxLength={50}
          placeholder="Your name"
        />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">
          Username
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            @
          </span>
          <Input
            data-ocid="my_profile.username_input"
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
            className="h-9 text-sm pl-7"
            maxLength={30}
            placeholder="username"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground mb-1.5 block">
          Bio
        </Label>
        <Textarea
          data-ocid="my_profile.bio_input"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="text-sm resize-none"
          rows={3}
          maxLength={160}
          placeholder="Tell people a bit about yourself"
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {bio.length}/160
        </p>
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          data-ocid="my_profile.save_button"
          size="sm"
          disabled={
            saveMutation.isPending || !displayName.trim() || !username.trim()
          }
          onClick={() => saveMutation.mutate()}
        >
          {saveMutation.isPending ? "Saving…" : "Save changes"}
        </Button>
        <Button
          data-ocid="my_profile.cancel_button"
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={saveMutation.isPending}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MyProfilePage() {
  const { isAuthenticated, isInitializing, principal } = useAuth();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  // Basic profile (username, displayName, bio, avatar)
  const { data: profile } = useQuery<UserProfile | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  // Full profile with counts — look up by principal
  const { data: fullProfile } = useQuery<Profile | null>({
    queryKey: ["myFullProfile", principal],
    queryFn: async () => {
      if (!actor || !principal) return null;
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.getProfile(Principal.fromText(principal));
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principal,
    staleTime: 30_000,
  });

  // My posts
  const { data: posts, isLoading: postsLoading } = useQuery<Post[]>({
    queryKey: ["myPosts", principal],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const { Principal } = await import("@icp-sdk/core/principal");
      const page = await actor.listPostsByAuthor(
        Principal.fromText(principal),
        0n,
        60n,
      );
      return page.items;
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principal,
    staleTime: 30_000,
  });

  // Followers
  const { data: followerPrincipals } = useQuery<string[]>({
    queryKey: ["myFollowers", principal],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const { Principal } = await import("@icp-sdk/core/principal");
      const page = await actor.getFollowers(
        Principal.fromText(principal),
        0n,
        50n,
      );
      return page.items.map((p) => p.toString());
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principal,
    staleTime: 30_000,
  });

  // Following
  const { data: followingPrincipals } = useQuery<string[]>({
    queryKey: ["myFollowing", principal],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const { Principal } = await import("@icp-sdk/core/principal");
      const page = await actor.getFollowing(
        Principal.fromText(principal),
        0n,
        50n,
      );
      return page.items.map((p) => p.toString());
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!principal,
    staleTime: 30_000,
  });

  if (!isAuthenticated && !isInitializing) return null;

  const followerList = followerPrincipals ?? [];
  const followingList = followingPrincipals ?? [];

  return (
    <div
      data-ocid="my_profile.page"
      className="max-w-2xl mx-auto pb-24 md:pb-6"
    >
      {/* ── Header ── */}
      <div className="px-4 pt-6 pb-5">
        {editing ? (
          <EditForm
            profile={profile ?? null}
            onSaved={() => setEditing(false)}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <AvatarImage
              blob={profile?.avatarBlob}
              displayName={profile?.displayName}
              username={profile?.username}
              size="xl"
              className="!w-24 !h-24 !text-2xl flex-shrink-0"
            />

            {/* Info */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="min-w-0">
                  <h1 className="font-display text-xl font-bold text-foreground truncate leading-tight">
                    {profile?.displayName || (
                      <span className="text-muted-foreground">Your Name</span>
                    )}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    @{profile?.username || "username"}
                  </p>
                </div>
                <Button
                  data-ocid="my_profile.edit_button"
                  size="sm"
                  variant="outline"
                  onClick={() => setEditing(true)}
                  className="flex-shrink-0"
                >
                  Edit profile
                </Button>
              </div>

              {profile?.bio ? (
                <p className="text-sm text-foreground leading-relaxed mt-2 mb-3">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic mt-2 mb-3">
                  No bio yet — add one to tell people about yourself.
                </p>
              )}

              {/* Stats */}
              <div className="flex gap-5 mt-3 text-sm">
                <span className="font-semibold text-foreground">
                  {Number(fullProfile?.postCount ?? 0n)}
                  <span className="font-normal text-muted-foreground ml-1">
                    posts
                  </span>
                </span>
                <span className="font-semibold text-foreground">
                  {Number(fullProfile?.followerCount ?? 0n)}
                  <span className="font-normal text-muted-foreground ml-1">
                    followers
                  </span>
                </span>
                <span className="font-semibold text-foreground">
                  {Number(fullProfile?.followingCount ?? 0n)}
                  <span className="font-normal text-muted-foreground ml-1">
                    following
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border" />

      {/* ── Tabs ── */}
      <Tabs defaultValue="posts" data-ocid="my_profile.tabs">
        <TabsList className="w-full rounded-none border-b border-border bg-transparent h-11 gap-0 px-0">
          <TabsTrigger
            data-ocid="my_profile.posts_tab"
            value="posts"
            className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent gap-1.5 text-xs font-medium uppercase tracking-wide"
          >
            <Grid3X3 className="h-3.5 w-3.5" />
            Posts
          </TabsTrigger>
          <TabsTrigger
            data-ocid="my_profile.followers_tab"
            value="followers"
            className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent gap-1.5 text-xs font-medium uppercase tracking-wide"
          >
            <Users className="h-3.5 w-3.5" />
            Followers
          </TabsTrigger>
          <TabsTrigger
            data-ocid="my_profile.following_tab"
            value="following"
            className="flex-1 h-full rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent gap-1.5 text-xs font-medium uppercase tracking-wide"
          >
            <Users className="h-3.5 w-3.5" />
            Following
          </TabsTrigger>
        </TabsList>

        {/* Posts Grid */}
        <TabsContent value="posts" className="mt-0 focus-visible:outline-none">
          {postsLoading ? (
            <div
              data-ocid="my_profile.posts_loading_state"
              className="grid grid-cols-3 gap-0.5 p-0.5"
            >
              {["a", "b", "c", "d", "e", "f", "g", "h", "i"].map((k) => (
                <Skeleton
                  key={k}
                  className="aspect-square w-full rounded-none"
                />
              ))}
            </div>
          ) : !posts || posts.length === 0 ? (
            <div
              data-ocid="my_profile.posts_empty_state"
              className="flex flex-col items-center py-16 px-4 text-center"
            >
              <ImageOff className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="font-medium text-foreground mb-1">No posts yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Share your first photo or thought with the world.
              </p>
              <Button
                data-ocid="my_profile.create_post_button"
                size="sm"
                onClick={() => navigate({ to: "/home" })}
              >
                Create post
              </Button>
            </div>
          ) : (
            <div
              data-ocid="my_profile.posts_grid"
              className="grid grid-cols-3 gap-0.5 p-0.5"
            >
              {posts.map((post, i) => (
                <PostThumbnail key={post.id.toString()} post={post} index={i} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Followers */}
        <TabsContent
          value="followers"
          className="mt-0 focus-visible:outline-none"
        >
          {followerList.length === 0 ? (
            <div
              data-ocid="my_profile.followers_empty_state"
              className="flex flex-col items-center py-16 px-4 text-center"
            >
              <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="font-medium text-foreground mb-1">
                No followers yet
              </p>
              <p className="text-sm text-muted-foreground">
                Keep posting and people will start following you.
              </p>
            </div>
          ) : (
            <div
              data-ocid="my_profile.followers_list"
              className="divide-y divide-border"
            >
              {followerList.map((p, i) => (
                <UserListItem
                  key={p}
                  principal={p}
                  index={i}
                  showChat={false}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Following */}
        <TabsContent
          value="following"
          className="mt-0 focus-visible:outline-none"
        >
          {followingList.length === 0 ? (
            <div
              data-ocid="my_profile.following_empty_state"
              className="flex flex-col items-center py-16 px-4 text-center"
            >
              <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="font-medium text-foreground mb-1">
                You're not following anyone
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Discover and follow people to see their posts in your feed.
              </p>
              <Button
                data-ocid="my_profile.explore_button"
                size="sm"
                variant="outline"
                onClick={() => navigate({ to: "/explore" })}
              >
                Explore people
              </Button>
            </div>
          ) : (
            <div
              data-ocid="my_profile.following_list"
              className="divide-y divide-border"
            >
              {followingList.map((p, i) => (
                <UserListItem key={p} principal={p} index={i} showChat={true} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
