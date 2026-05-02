import { createActor } from "@/backend";
import { NotificationType } from "@/backend";
import { AvatarImage } from "@/components/AvatarImage";
import { PostCreateModal } from "@/components/PostCreateModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import type { Notification } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  Compass,
  Home,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  PenSquare,
  Search,
  Shield,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

function notifLabel(n: Notification): string {
  const from = `${n.fromPrincipal.toString().slice(0, 8)}…`;
  switch (n.notifType) {
    case NotificationType.like:
      return `${from} liked your post`;
    case NotificationType.comment:
      return `${from} commented on your post`;
    case NotificationType.newFollower:
      return `${from} started following you`;
  }
}

interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  ocid: string;
  onClick?: () => void;
}

function NavLink({ to, label, icon, badge, ocid, onClick }: NavLinkProps) {
  const router = useRouterState();
  const isActive =
    router.location.pathname === to ||
    router.location.pathname.startsWith(`${to}/`);
  return (
    <Link
      to={to}
      data-ocid={ocid}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth relative
        ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
      {badge !== undefined && badge > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] leading-none flex items-center justify-center"
        >
          {badge > 99 ? "99+" : badge}
        </Badge>
      )}
    </Link>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    login,
    logout,
    profile,
  } = useAuth();

  const isAdminAllowed =
    profile?.displayName?.trim().toLowerCase() === "mehul malhotra";
  const { unreadCount, notifications, markRead, markAllRead } =
    useNotifications(10);
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { pathname } = routerState.location;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(
    () => sessionStorage.getItem("adminUnlocked") === "1",
  );

  // Refresh admin unlock state whenever the route changes
  const adminCheckKey = pathname;
  if (adminCheckKey) {
    const current = sessionStorage.getItem("adminUnlocked") === "1";
    if (current !== isAdminUnlocked) setIsAdminUnlocked(current);
  }

  // Fetch unread message count
  const { actor, isFetching } = useActor(createActor);
  const { data: unreadMessages = 0 } = useQuery<number>({
    queryKey: ["unreadMessageCount"],
    queryFn: async () => {
      if (!actor) return 0;
      return Number(await actor.getUnreadMessageCount());
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    refetchInterval: 15_000,
  });

  // Fetch pending request count
  const { data: pendingRequests = 0 } = useQuery<number>({
    queryKey: ["pendingRequestCount"],
    queryFn: async () => {
      if (!actor) return 0;
      return Number(await actor.getPendingRequestCount());
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    refetchInterval: 30_000,
  });

  const recentNotifications = notifications.slice(0, 10);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Nav */}
      <header
        data-ocid="nav.header"
        className="sticky top-0 z-40 bg-card border-b border-border shadow-xs"
      >
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
          {/* Logo */}
          <Link
            to={isAuthenticated ? "/home" : "/"}
            data-ocid="nav.logo_link"
            className="font-display text-xl font-bold text-foreground flex-shrink-0 mr-2"
          >
            Socialite
          </Link>

          {/* Search (desktop) */}
          <div className="hidden md:flex flex-1 max-w-xs relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              data-ocid="nav.search_input"
              type="search"
              placeholder="Search…"
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-muted rounded-lg border border-input focus:outline-none focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              readOnly
            />
          </div>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1 ml-auto">
            {isAuthenticated && (
              <>
                <NavLink
                  to="/home"
                  label="Home"
                  icon={<Home className="h-4 w-4" />}
                  ocid="nav.home_link"
                />
                <NavLink
                  to="/explore"
                  label="Explore"
                  icon={<Compass className="h-4 w-4" />}
                  ocid="nav.explore_link"
                />
                <NavLink
                  to="/requests"
                  label="Requests"
                  icon={<UserPlus className="h-4 w-4" />}
                  badge={pendingRequests}
                  ocid="nav.requests_link"
                />
                <NavLink
                  to="/chat"
                  label="Messages"
                  icon={<MessageCircle className="h-4 w-4" />}
                  badge={unreadMessages}
                  ocid="nav.chat_link"
                />

                {isAdminUnlocked && isAdminAllowed && (
                  <NavLink
                    to="/admin"
                    label="Admin"
                    icon={<Shield className="h-4 w-4" />}
                    ocid="nav.admin_link"
                  />
                )}

                {/* Notifications dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      data-ocid="nav.notifications_button"
                      className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                    >
                      <Bell className="h-4 w-4" />
                      <span className="hidden lg:inline">Notifications</span>
                      {unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] leading-none flex items-center justify-center"
                        >
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </Badge>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    data-ocid="nav.notifications_dropdown"
                    align="end"
                    className="w-80 bg-popover border-border"
                  >
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          data-ocid="nav.mark_all_read_button"
                          className="text-xs text-primary hover:underline"
                          onClick={markAllRead}
                        >
                          Mark all read
                        </button>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {recentNotifications.length === 0 ? (
                      <div
                        data-ocid="nav.notifications_empty_state"
                        className="py-6 text-center text-sm text-muted-foreground"
                      >
                        No notifications yet
                      </div>
                    ) : (
                      recentNotifications.map((n, i) => (
                        <DropdownMenuItem
                          data-ocid={`nav.notification_item.${i + 1}`}
                          key={n.id.toString()}
                          className={`flex flex-col items-start gap-0.5 px-3 py-2.5 cursor-pointer ${!n.read ? "bg-primary/5" : ""}`}
                          onClick={() => {
                            markRead(n.id);
                            navigate({ to: "/notifications" });
                          }}
                        >
                          <span
                            className={`text-sm ${!n.read ? "font-medium text-foreground" : "text-muted-foreground"}`}
                          >
                            {notifLabel(n)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(Number(n.createdAt / 1_000_000n)),
                              { addSuffix: true },
                            )}
                          </span>
                        </DropdownMenuItem>
                      ))
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/notifications"
                        data-ocid="nav.all_notifications_link"
                        className="w-full text-center text-sm text-primary justify-center"
                      >
                        View all notifications
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  data-ocid="nav.profile_button"
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-smooth ml-1"
                >
                  <AvatarImage
                    blob={profile?.avatarBlob}
                    displayName={profile?.displayName}
                    username={profile?.username}
                    size="xs"
                  />
                  <span className="hidden lg:block text-sm font-medium text-foreground max-w-[100px] truncate">
                    {profile?.displayName ??
                      (isAuthenticated ? "Profile" : "Account")}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                data-ocid="nav.profile_dropdown"
                align="end"
                className="w-48 bg-popover border-border"
              >
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/profile/me" data-ocid="nav.my_profile_link">
                        <User className="h-4 w-4 mr-2" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      data-ocid="nav.logout_button"
                      onClick={logout}
                      className="text-destructive"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem
                    data-ocid="nav.login_button"
                    disabled={isInitializing || isLoggingIn}
                    onClick={login}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    {isInitializing ? "Loading…" : "Log in"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated && (
              <Button
                data-ocid="nav.create_post_button"
                size="sm"
                className="btn-primary ml-1 gap-1.5"
                onClick={() => setCreatePostOpen(true)}
              >
                <PenSquare className="h-4 w-4" />
                <span className="hidden lg:inline">Post</span>
              </Button>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            data-ocid="nav.mobile_menu_button"
            className="md:hidden ml-auto p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div
            data-ocid="nav.mobile_menu"
            className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-1 animate-slide-down"
          >
            {/* Mobile search */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                data-ocid="nav.mobile_search_input"
                type="search"
                placeholder="Search…"
                className="w-full pl-9 pr-3 py-2 text-sm bg-muted rounded-lg border border-input focus:outline-none focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                readOnly
              />
            </div>

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/home"
                  label="Home"
                  icon={<Home className="h-4 w-4" />}
                  ocid="nav.mobile.home_link"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <NavLink
                  to="/explore"
                  label="Explore"
                  icon={<Compass className="h-4 w-4" />}
                  ocid="nav.mobile.explore_link"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <NavLink
                  to="/requests"
                  label="Requests"
                  icon={<UserPlus className="h-4 w-4" />}
                  badge={pendingRequests}
                  ocid="nav.mobile.requests_link"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <NavLink
                  to="/chat"
                  label="Messages"
                  icon={<MessageCircle className="h-4 w-4" />}
                  badge={unreadMessages}
                  ocid="nav.mobile.chat_link"
                  onClick={() => setMobileMenuOpen(false)}
                />
                {isAdminUnlocked && isAdminAllowed && (
                  <NavLink
                    to="/admin"
                    label="Admin"
                    icon={<Shield className="h-4 w-4" />}
                    ocid="nav.mobile.admin_link"
                    onClick={() => setMobileMenuOpen(false)}
                  />
                )}
                <NavLink
                  to="/notifications"
                  label="Notifications"
                  icon={<Bell className="h-4 w-4" />}
                  badge={unreadCount}
                  ocid="nav.mobile.notifications_link"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <NavLink
                  to="/profile/me"
                  label="My Profile"
                  icon={<User className="h-4 w-4" />}
                  ocid="nav.mobile.profile_link"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <Button
                  data-ocid="nav.mobile.create_post_button"
                  size="sm"
                  className="btn-primary mt-2 gap-2 w-full justify-center"
                  onClick={() => {
                    setCreatePostOpen(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  <PenSquare className="h-4 w-4" />
                  New Post
                </Button>
                <button
                  type="button"
                  data-ocid="nav.mobile.logout_button"
                  className="w-full text-left px-3 py-2 text-sm text-destructive rounded-lg hover:bg-muted transition-smooth mt-1"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <Button
                data-ocid="nav.mobile.login_button"
                className="btn-primary w-full justify-center gap-2"
                disabled={isInitializing || isLoggingIn}
                onClick={() => {
                  login();
                  setMobileMenuOpen(false);
                }}
              >
                <LogIn className="h-4 w-4" />
                {isInitializing ? "Loading…" : "Log in"}
              </Button>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Mobile bottom tab bar */}
      {isAuthenticated && (
        <nav
          data-ocid="nav.mobile_tab_bar"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex items-center justify-around px-2 py-2 safe-area-pb"
        >
          {(
            [
              {
                to: "/home",
                ocid: "nav.tab.home",
                icon: <Home className="h-5 w-5" />,
                label: "Home",
                badge: 0,
              },
              {
                to: "/explore",
                ocid: "nav.tab.explore",
                icon: <Compass className="h-5 w-5" />,
                label: "Explore",
                badge: 0,
              },
              {
                to: "/requests",
                ocid: "nav.tab.requests",
                icon: <UserPlus className="h-5 w-5" />,
                label: "Requests",
                badge: pendingRequests,
              },
              {
                to: "/chat",
                ocid: "nav.tab.chat",
                icon: <MessageCircle className="h-5 w-5" />,
                label: "Messages",
                badge: unreadMessages,
              },
            ] as const
          ).map(({ to, ocid, icon, label, badge }) => {
            const active = pathname === to || pathname.startsWith(`${to}/`);
            return (
              <Link
                key={to}
                to={to}
                data-ocid={ocid}
                className={`relative flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                {icon}
                {badge > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
                )}
                <span className="text-[10px]">{label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            data-ocid="nav.tab.create"
            className="flex flex-col items-center gap-0.5 p-2 rounded-lg text-muted-foreground"
            onClick={() => setCreatePostOpen(true)}
          >
            <PenSquare className="h-5 w-5" />
            <span className="text-[10px]">Post</span>
          </button>
          <Link
            to="/notifications"
            data-ocid="nav.tab.notifications"
            className={`relative flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors ${pathname === "/notifications" ? "text-primary" : "text-muted-foreground"}`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
            )}
            <span className="text-[10px]">Alerts</span>
          </Link>
          <Link
            to="/profile/me"
            data-ocid="nav.tab.profile"
            className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors ${pathname === "/profile/me" || pathname.startsWith("/profile/me") ? "text-primary" : "text-muted-foreground"}`}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px]">Profile</span>
          </Link>
        </nav>
      )}

      <PostCreateModal open={createPostOpen} onOpenChange={setCreatePostOpen} />
    </div>
  );
}
