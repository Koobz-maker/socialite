import { createActor } from "@/backend";
import type { FollowRequest, Profile } from "@/backend";
import { FollowRequestStatus } from "@/backend";
import { AvatarImage } from "@/components/AvatarImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, UserCheck, UserMinus, Users } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

function RequestItemSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="w-11 h-11 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}

function RequestItem({
  request,
  index,
  onAction,
}: {
  request: FollowRequest;
  index: number;
  onAction: () => void;
}) {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const fromPrincipal = request.from.toString();

  const { data: profile } = useQuery<Profile | null>({
    queryKey: ["profile", fromPrincipal],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(request.from);
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  // Approve by passing the requester's Principal (request.from), not the numeric id
  const approveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.approveFollowRequest(request.from);
    },
    onSuccess: () => {
      toast.success(`Approved ${profile?.displayName ?? "request"}`);
      queryClient.invalidateQueries({ queryKey: ["myFollowRequests"] });
      queryClient.invalidateQueries({ queryKey: ["pendingRequestCount"] });
      onAction();
    },
    onError: () => toast.error("Failed to approve request"),
  });

  // Decline by passing the requester's Principal (request.from), not the numeric id
  const declineMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.declineFollowRequest(request.from);
    },
    onSuccess: () => {
      toast.success("Request declined");
      queryClient.invalidateQueries({ queryKey: ["myFollowRequests"] });
      queryClient.invalidateQueries({ queryKey: ["pendingRequestCount"] });
      onAction();
    },
    onError: () => toast.error("Failed to decline request"),
  });

  const isPending = approveMutation.isPending || declineMutation.isPending;

  return (
    <div
      data-ocid={`requests.item.${index + 1}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
    >
      <button
        type="button"
        className="flex-shrink-0"
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
            className="!w-11 !h-11"
          />
        ) : (
          <Skeleton className="w-11 h-11 rounded-full" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        {profile ? (
          <>
            <button
              type="button"
              className="text-sm font-semibold text-foreground truncate leading-tight text-left hover:underline"
              onClick={() => navigate({ to: `/profile/${profile.username}` })}
            >
              {profile.displayName}
            </button>
            <p className="text-xs text-muted-foreground truncate">
              @{profile.username}
            </p>
            {profile.bio && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {profile.bio}
              </p>
            )}
          </>
        ) : (
          <div className="space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <Button
          data-ocid={`requests.approve_button.${index + 1}`}
          size="sm"
          disabled={isPending}
          onClick={() => approveMutation.mutate()}
          className="gap-1.5"
        >
          <UserCheck className="h-3.5 w-3.5" />
          Approve
        </Button>
        <Button
          data-ocid={`requests.decline_button.${index + 1}`}
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => declineMutation.mutate()}
          className="gap-1.5"
        >
          <UserMinus className="h-3.5 w-3.5" />
          Decline
        </Button>
      </div>
    </div>
  );
}

export default function RequestsPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) navigate({ to: "/" });
  }, [isAuthenticated, isInitializing, navigate]);

  const { data: requests, isLoading } = useQuery<FollowRequest[]>({
    queryKey: ["myFollowRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyFollowRequests();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 15_000,
  });

  const pending = (requests ?? []).filter(
    (r) => r.status === FollowRequestStatus.pending,
  );

  const handleAction = () => {
    queryClient.invalidateQueries({ queryKey: ["myFollowRequests"] });
  };

  if (!isAuthenticated && !isInitializing) return null;

  return (
    <div data-ocid="requests.page" className="max-w-2xl mx-auto pb-24 md:pb-6">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="font-display text-xl font-bold text-foreground">
            Follow Requests
          </h1>
          {pending.length > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {pending.length}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          People who want to follow you
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div
          data-ocid="requests.loading_state"
          className="divide-y divide-border"
        >
          {[1, 2, 3].map((k) => (
            <RequestItemSkeleton key={k} />
          ))}
        </div>
      ) : pending.length === 0 ? (
        <div
          data-ocid="requests.empty_state"
          className="flex flex-col items-center py-20 px-4 text-center"
        >
          <CheckCircle2 className="h-14 w-14 text-muted-foreground/40 mb-4" />
          <p className="font-semibold text-foreground mb-1">All caught up!</p>
          <p className="text-sm text-muted-foreground">
            No pending follow requests right now.
          </p>
        </div>
      ) : (
        <div data-ocid="requests.list" className="divide-y divide-border">
          {pending.map((req, i) => (
            <RequestItem
              key={req.id.toString()}
              request={req}
              index={i}
              onAction={handleAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
