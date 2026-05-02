import Common "common";

module {
  public type UserId = Common.UserId;
  public type NotificationId = Common.NotificationId;
  public type PostId = Common.PostId;

  public type NotificationType = {
    #like;
    #comment;
    #newFollower;
  };

  // Internal mutable notification
  public type NotificationInternal = {
    id : NotificationId;
    notifType : NotificationType;
    fromPrincipal : UserId;
    postId : ?PostId;
    var read : Bool;
    createdAt : Common.Timestamp;
  };

  // Shared notification for API boundary
  public type Notification = {
    id : NotificationId;
    notifType : NotificationType;
    fromPrincipal : UserId;
    postId : ?PostId;
    read : Bool;
    createdAt : Common.Timestamp;
  };
};
