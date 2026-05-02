import { NotificationType, createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Bell, Heart, MessageCircle, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 20;

type FilterTab = "all" | "likes" | "comments" | "follows";

const TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "likes", label: "Likes" },
  { id: "comments", label: "Comments" },
  { id: "follows", label: "Follows" },
];

function notifIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.like:
      return <Heart className="h-4 w-4 text-destructive" aria-hidden="true" />;
    case NotificationType.comment:
      return (
        <MessageCircle className="h-4 w-4 text-accent" aria-hidden="true" />
      );
    case NotificationType.newFollower:
      return <UserPlus className="h-4 w-4 text-primary" aria-hidden="true" />;
  }
}

function notifText(n: Notification): string {
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

function filterNotifications(
  notifications: Notification[],
  tab: FilterTab,
): Notification[] {
  if (tab === "all") return notifications;
  if (tab === "likes")
    return notifications.filter((n) => n.notifType === NotificationType.like);
  if (tab === "comments")
    return notifications.filter(
      (n) => n.notifType === NotificationType.comment,
    );
  if (tab === "follows")
    return notifications.filter(
      (n) => n.notifType === NotificationType.newFollower,
    );
  return notifications;
}

const SKELETON_KEYS = ["a", "b", "c", "d", "e", "f"];

function NotificationSkeleton({ id }: { id: string }) {
  return (
    <div key={id} className="flex items-start gap-3 px-4 py-3.5">
      <Skeleton className="w-9 h-9 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const { notifications, unreadCount, isLoading, markRead, markAllRead } =
    useNotifications(200);

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const filtered = useMemo(
    () => filterNotifications(notifications, activeTab),
    [notifications, activeTab],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleNotifClick = async (n: Notification) => {
    markRead(n.id);
    if (
      (n.notifType === NotificationType.like ||
        n.notifType === NotificationType.comment) &&
      n.postId !== undefined
    ) {
      navigate({
        to: "/post/$postId",
        params: { postId: n.postId.toString() },
      });
    } else if (n.notifType === NotificationType.newFollower) {
      // Resolve principal → username before navigating
      try {
        const profile = actor
          ? await actor.getUserProfile(n.fromPrincipal)
          : null;
        if (profile?.username) {
          navigate({
            to: "/profile/$username",
            params: { username: profile.username },
          });
        } else {
          toast.info("Could not resolve follower profile.");
        }
      } catch {
        toast.info("Could not resolve follower profile.");
      }
    }
  };

  if (!isAuthenticated && !isInitializing) return null;

  return (
    <div
      data-ocid="notifications.page"
      className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Notifications
        </h1>
        {unreadCount > 0 && (
          <Button
            data-ocid="notifications.mark_all_read_button"
            variant="ghost"
            size="sm"
            onClick={markAllRead}
            className="text-primary text-sm font-medium hover:text-primary/80"
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div
        data-ocid="notifications.filter_tabs"
        className="flex items-center gap-1 mb-5 bg-muted p-1 rounded-lg"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            data-ocid={`notifications.filter.${tab.id}`}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-smooth",
              activeTab === tab.id
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div data-ocid="notifications.loading_state" className="space-y-1">
          {SKELETON_KEYS.map((k) => (
            <NotificationSkeleton key={k} id={k} />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div
          data-ocid="notifications.empty_state"
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell
              className="h-8 w-8 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <h2 className="font-semibold text-foreground mb-2">
            {activeTab === "all"
              ? "No notifications yet"
              : `No ${activeTab} yet`}
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            {activeTab === "all"
              ? "Engage with others to start seeing activity here."
              : `You'll see ${activeTab} notifications here when they arrive.`}
          </p>
        </div>
      ) : (
        <>
          <ul data-ocid="notifications.list" className="space-y-0.5">
            {paginated.map((n, i) => (
              <li key={n.id.toString()}>
                <button
                  type="button"
                  data-ocid={`notifications.item.${(currentPage - 1) * PAGE_SIZE + i + 1}`}
                  className={cn(
                    "w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-lg transition-smooth hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    !n.read && "bg-primary/5",
                  )}
                  onClick={() => handleNotifClick(n)}
                  aria-label={notifText(n)}
                >
                  {/* Type icon */}
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-muted flex items-center justify-center mt-0.5">
                    {notifIcon(n.notifType)}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm leading-snug break-words",
                        !n.read
                          ? "font-semibold text-foreground"
                          : "text-foreground/80",
                      )}
                    >
                      {notifText(n)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(
                        new Date(Number(n.createdAt / 1_000_000n)),
                        { addSuffix: true },
                      )}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!n.read && (
                    <span
                      className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2.5"
                      aria-label="Unread"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              data-ocid="notifications.pagination"
              className="flex items-center justify-between mt-6 pt-4 border-t border-border"
            >
              <Button
                data-ocid="notifications.pagination_prev"
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                data-ocid="notifications.pagination_next"
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
