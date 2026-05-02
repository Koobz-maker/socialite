import { createActor } from "@/backend";
import type { Post, Profile } from "@/backend";
import { AvatarImage } from "@/components/AvatarImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useActor } from "@caffeineai/core-infrastructure";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Heart,
  Lock,
  MessageCircle,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function isMehulMalhotra(displayName?: string): boolean {
  return displayName?.trim().toLowerCase() === "mehul malhotra";
}

const ADMIN_CODE = "63372";
const SESSION_KEY = "adminUnlocked";

// ── Access Denied ─────────────────────────────────────────────────────────────

function AccessDenied() {
  const navigate = useNavigate();
  return (
    <div
      data-ocid="admin.access_denied_page"
      className="min-h-[80vh] flex items-center justify-center px-4"
    >
      <Card className="w-full max-w-sm p-8 flex flex-col items-center gap-6 border-border shadow-md">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
            <Lock className="h-7 w-7 text-destructive" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Access Denied
          </h1>
          <p className="text-sm text-muted-foreground">
            This area is restricted to authorised administrators only.
          </p>
        </div>
        <Button
          data-ocid="admin.access_denied_home_button"
          variant="outline"
          className="w-full"
          onClick={() => navigate({ to: "/home" })}
        >
          Go to Home
        </Button>
      </Card>
    </div>
  );
}

// ── Gate ──────────────────────────────────────────────────────────────────────

function AdminGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

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

  return (
    <div
      data-ocid="admin.gate_page"
      className="min-h-[80vh] flex items-center justify-center px-4"
    >
      <Card
        className={`w-full max-w-sm p-8 flex flex-col items-center gap-6 border-border shadow-md ${shaking ? "animate-pulse" : ""}`}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Admin Access
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your admin passcode to continue
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <input
            data-ocid="admin.gate_code_input"
            type="password"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
            placeholder="Enter passcode"
            autoComplete="off"
            className="w-full px-4 py-3 text-center text-xl tracking-[0.4em] bg-muted border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground placeholder:tracking-normal"
          />

          {error && (
            <p
              data-ocid="admin.gate_error"
              className="text-sm text-destructive text-center flex items-center justify-center gap-1.5"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              {error}
            </p>
          )}

          <Button
            data-ocid="admin.gate_unlock_button"
            className="w-full btn-primary"
            onClick={handleUnlock}
          >
            Unlock
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────

function PostSkeleton() {
  return (
    <div className="flex items-start gap-3 py-3">
      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-full" />
      </div>
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  );
}

function UserSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3">
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-1.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-8 w-20 rounded" />
    </div>
  );
}

function AdminPostsTab({ onLogout }: { onLogout: () => void }) {
  const { actor, isFetching } = useActor(createActor);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextOffset, setNextOffset] = useState<bigint | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<bigint>>(new Set());

  const fetchPosts = useCallback(
    async (offset: bigint) => {
      if (!actor) return;
      const page = await actor.getExploreFeed(offset, 20n);
      if (offset === 0n) {
        setPosts(page.items);
      } else {
        setPosts((prev) => [...prev, ...page.items]);
      }
      setNextOffset(page.nextOffset);
      setHasMore(page.nextOffset !== undefined && page.nextOffset !== null);
    },
    [actor],
  );

  useEffect(() => {
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

  async function handleDelete(postId: bigint) {
    if (!actor) return;
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    setDeletingIds((prev) => new Set(prev).add(postId));
    try {
      const ok = await actor.deletePost(postId);
      if (ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        toast.success("Post deleted");
      } else {
        toast.error("Could not delete post");
      }
    } catch {
      toast.error("Error deleting post");
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading…" : `${posts.length} posts loaded`}
        </p>
        <Button
          variant="outline"
          size="sm"
          data-ocid="admin.logout_button"
          onClick={onLogout}
          className="text-destructive border-destructive/30 hover:bg-destructive/10"
        >
          Logout Admin
        </Button>
      </div>

      {loading ? (
        <div data-ocid="admin.posts.loading_state">
          {["a", "b", "c", "d", "e"].map((k) => (
            <PostSkeleton key={k} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div
          data-ocid="admin.posts.empty_state"
          className="py-16 text-center text-muted-foreground"
        >
          No posts found.
        </div>
      ) : (
        <div className="divide-y divide-border" data-ocid="admin.posts.list">
          {posts.map((post, i) => (
            <div
              key={post.id.toString()}
              data-ocid={`admin.posts.item.${i + 1}`}
              className="flex items-start gap-3 py-3"
            >
              {/* Author avatar placeholder */}
              <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5 truncate">
                  {post.authorPrincipal.toString().slice(0, 20)}…
                </p>
                {post.caption && (
                  <p className="text-sm text-foreground line-clamp-2">
                    {post.caption}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {post.likeCount.toString()}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {post.commentCount.toString()}
                  </span>
                  {post.photoBlob && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] h-4 px-1.5"
                    >
                      Photo
                    </Badge>
                  )}
                </div>
              </div>

              <Button
                data-ocid={`admin.posts.delete_button.${i + 1}`}
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                disabled={deletingIds.has(post.id)}
                onClick={() => handleDelete(post.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="pt-4 flex justify-center">
          <Button
            data-ocid="admin.posts.load_more_button"
            variant="outline"
            size="sm"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}

function AdminUsersTab() {
  const { actor, isFetching } = useActor(createActor);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextOffset, setNextOffset] = useState<bigint | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);

  const fetchUsers = useCallback(
    async (offset: bigint) => {
      if (!actor) return;
      const page = await actor.searchUsers("", offset, 20n);
      if (offset === 0n) {
        setUsers(page.items);
      } else {
        setUsers((prev) => [...prev, ...page.items]);
      }
      setNextOffset(page.nextOffset);
      setHasMore(page.nextOffset !== undefined && page.nextOffset !== null);
    },
    [actor],
  );

  useEffect(() => {
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

  return (
    <div className="space-y-1">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading…" : `${users.length} users loaded`}
        </p>
      </div>

      {loading ? (
        <div data-ocid="admin.users.loading_state">
          {["a", "b", "c", "d", "e"].map((k) => (
            <UserSkeleton key={k} />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div
          data-ocid="admin.users.empty_state"
          className="py-16 text-center text-muted-foreground"
        >
          No users found.
        </div>
      ) : (
        <div className="divide-y divide-border" data-ocid="admin.users.list">
          {users.map((user, i) => (
            <div
              key={user.principal.toString()}
              data-ocid={`admin.users.item.${i + 1}`}
              className="flex items-center gap-3 py-3"
            >
              <AvatarImage
                blob={user.avatarBlob}
                displayName={user.displayName}
                username={user.username}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.displayName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  @{user.username} ·{" "}
                  <span>{user.followerCount.toString()} followers</span>
                </p>
              </div>
              <Link
                to="/profile/$username"
                params={{ username: user.username }}
                data-ocid={`admin.users.view_link.${i + 1}`}
                className="text-xs text-primary hover:underline flex-shrink-0"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="pt-4 flex justify-center">
          <Button
            data-ocid="admin.users.load_more_button"
            variant="outline"
            size="sm"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  return (
    <div
      data-ocid="admin.dashboard_page"
      className="max-w-3xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Shield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Admin Panel
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage posts and users
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" data-ocid="admin.tabs">
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger
            value="posts"
            data-ocid="admin.posts_tab"
            className="flex-1 sm:flex-none gap-2"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="users"
            data-ocid="admin.users_tab"
            className="flex-1 sm:flex-none gap-2"
          >
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <AdminPostsTab onLogout={onLogout} />
        </TabsContent>

        <TabsContent value="users">
          <AdminUsersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Page Entry Point ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const { profile, isInitializing } = useAuth();
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1",
  );

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
  }

  // While the profile is still loading, render nothing to avoid a flash of
  // the access-denied screen for Mehul while their profile resolves.
  if (isInitializing) return null;

  // Any user who is not Mehul Malhotra is blocked entirely.
  if (!isMehulMalhotra(profile?.displayName)) {
    return <AccessDenied />;
  }

  if (!unlocked) {
    return <AdminGate onUnlock={() => setUnlocked(true)} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
