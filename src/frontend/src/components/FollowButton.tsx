import { createActor } from "@/backend";
import { FollowRequestStatus } from "@/backend";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useActor } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface FollowButtonProps {
  targetPrincipal: Principal;
  targetUsername?: string;
  size?: "sm" | "default";
  className?: string;
}

export function FollowButton({
  targetPrincipal,
  targetUsername,
  size = "sm",
  className,
}: FollowButtonProps) {
  const { isAuthenticated } = useAuth();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const targetKey = targetPrincipal.toString();

  const { data: isFollowing } = useQuery<boolean>({
    queryKey: ["isFollowing", targetKey],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isFollowing(targetPrincipal);
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  const { data: requestStatus } = useQuery<FollowRequestStatus | null>({
    queryKey: ["requestStatus", targetKey],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRequestStatus(targetPrincipal);
    },
    enabled: !!actor && !isFetching && isAuthenticated && !isFollowing,
  });

  const isPending = requestStatus === FollowRequestStatus.pending;

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      if (isFollowing) return actor.unfollowUser(targetPrincipal);
      if (isPending) return false; // already requested — no-op
      return actor.sendFollowRequest(targetPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isFollowing", targetKey] });
      queryClient.invalidateQueries({ queryKey: ["requestStatus", targetKey] });
      queryClient.invalidateQueries({
        queryKey: ["profile", targetKey],
      });
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
    },
  });

  if (!isAuthenticated) return null;

  // Determine button label, variant, and disabled state
  let label: string;
  let variant: "default" | "outline" | "secondary";
  let disabled: boolean;

  if (isFollowing) {
    label = "Following";
    variant = "outline";
    disabled = mutation.isPending;
  } else if (isPending) {
    label = "Request Sent";
    variant = "secondary";
    disabled = true;
  } else {
    label = "Follow";
    variant = "default";
    disabled = mutation.isPending;
  }

  return (
    <Button
      data-ocid="follow.toggle"
      size={size}
      variant={variant}
      disabled={disabled}
      onClick={() => !disabled && mutation.mutate()}
      className={className}
      aria-label={`${label} ${targetUsername ?? "user"}`}
    >
      {label}
    </Button>
  );
}
