import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Int "mo:core/Int";
import NotifTypes "../types/notification";
import Common "../types/common";

module {
  public type NotifMap = Map.Map<Common.UserId, List.List<NotifTypes.NotificationInternal>>;

  // Add a notification to a user's list
  public func add(
    notifs : NotifMap,
    nextId : Nat,
    recipientPrincipal : Common.UserId,
    notifType : NotifTypes.NotificationType,
    fromPrincipal : Common.UserId,
    postId : ?Common.PostId,
    createdAt : Common.Timestamp,
  ) : NotifTypes.NotificationInternal {
    let notif : NotifTypes.NotificationInternal = {
      id = nextId;
      notifType;
      fromPrincipal;
      postId;
      var read = false;
      createdAt;
    };

    let list = switch (notifs.get(recipientPrincipal)) {
      case (?l) l;
      case null {
        let l = List.empty<NotifTypes.NotificationInternal>();
        notifs.add(recipientPrincipal, l);
        l;
      };
    };
    list.add(notif);
    notif;
  };

  // Get unread notification count for a user
  public func getUnreadCount(
    notifs : NotifMap,
    principal : Common.UserId,
  ) : Nat {
    switch (notifs.get(principal)) {
      case (?list) list.foldLeft<Nat, NotifTypes.NotificationInternal>(0, func(acc, n) { if (not n.read) acc + 1 else acc });
      case null 0;
    };
  };

  // Get all notifications (paginated), newest first
  public func list(
    notifs : NotifMap,
    principal : Common.UserId,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<NotifTypes.Notification> {
    let all = switch (notifs.get(principal)) {
      case (?l) {
        let arr = l.toArray();
        let sorted = arr.sort(func(a : NotifTypes.NotificationInternal, b : NotifTypes.NotificationInternal) : { #less; #equal; #greater } {
          Int.compare(b.createdAt, a.createdAt)
        });
        sorted.map(func(n : NotifTypes.NotificationInternal) : NotifTypes.Notification { toPublic(n) })
      };
      case null [];
    };

    let total = all.size();
    let start = if (offset >= total) total else offset;
    let end_ = if (start + limit > total) total else start + limit;
    let items = all.sliceToArray(start, end_);
    let nextOffset : ?Nat = if (end_ < total) ?(end_) else null;
    { items; nextOffset; total };
  };

  // Mark a specific notification as read
  public func markRead(
    notifs : NotifMap,
    principal : Common.UserId,
    notifId : Common.NotificationId,
  ) : Bool {
    switch (notifs.get(principal)) {
      case (?list) {
        switch (list.find(func(n : NotifTypes.NotificationInternal) : Bool = n.id == notifId)) {
          case (?n) { n.read := true; true };
          case null false;
        };
      };
      case null false;
    };
  };

  // Mark all notifications as read for a user
  public func markAllRead(
    notifs : NotifMap,
    principal : Common.UserId,
  ) {
    switch (notifs.get(principal)) {
      case (?list) list.forEach(func(n : NotifTypes.NotificationInternal) { n.read := true });
      case null {};
    };
  };

  // Convert internal notification to shared notification
  public func toPublic(internal : NotifTypes.NotificationInternal) : NotifTypes.Notification {
    {
      id = internal.id;
      notifType = internal.notifType;
      fromPrincipal = internal.fromPrincipal;
      postId = internal.postId;
      read = internal.read;
      createdAt = internal.createdAt;
    };
  };
};
