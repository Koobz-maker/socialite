import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import NotifLib "../lib/notification";
import NotifTypes "../types/notification";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  notifs : NotifLib.NotifMap,
) {
  // Get unread notification count for the caller
  public query ({ caller }) func getUnreadNotificationCount() : async Nat {
    NotifLib.getUnreadCount(notifs, caller);
  };

  // Get all notifications for the caller (paginated, newest first)
  public query ({ caller }) func getNotifications(
    offset : Nat,
    limit : Nat,
  ) : async Common.Page<NotifTypes.Notification> {
    NotifLib.list(notifs, caller, offset, limit);
  };

  // Mark a specific notification as read
  public shared ({ caller }) func markNotificationRead(notifId : Common.NotificationId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    NotifLib.markRead(notifs, caller, notifId);
  };

  // Mark all notifications as read
  public shared ({ caller }) func markAllNotificationsRead() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    NotifLib.markAllRead(notifs, caller);
  };
};
