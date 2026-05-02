import { u as useAuth, a as useActor, b as useQueryClient, d as useQuery, F as FollowRequestStatus, e as useMutation, j as jsxRuntimeExports, B as Button, g as createActor } from "./index-Dq5HxgdE.js";
function FollowButton({
  targetPrincipal,
  targetUsername,
  size = "sm",
  className
}) {
  const { isAuthenticated } = useAuth();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const targetKey = targetPrincipal.toString();
  const { data: isFollowing } = useQuery({
    queryKey: ["isFollowing", targetKey],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isFollowing(targetPrincipal);
    },
    enabled: !!actor && !isFetching && isAuthenticated
  });
  const { data: requestStatus } = useQuery({
    queryKey: ["requestStatus", targetKey],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRequestStatus(targetPrincipal);
    },
    enabled: !!actor && !isFetching && isAuthenticated && !isFollowing
  });
  const isPending = requestStatus === FollowRequestStatus.pending;
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      if (isFollowing) return actor.unfollowUser(targetPrincipal);
      if (isPending) return false;
      return actor.sendFollowRequest(targetPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isFollowing", targetKey] });
      queryClient.invalidateQueries({ queryKey: ["requestStatus", targetKey] });
      queryClient.invalidateQueries({
        queryKey: ["profile", targetKey]
      });
      queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] });
    }
  });
  if (!isAuthenticated) return null;
  let label;
  let variant;
  let disabled;
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button,
    {
      "data-ocid": "follow.toggle",
      size,
      variant,
      disabled,
      onClick: () => !disabled && mutation.mutate(),
      className,
      "aria-label": `${label} ${targetUsername ?? "user"}`,
      children: label
    }
  );
}
export {
  FollowButton as F
};
