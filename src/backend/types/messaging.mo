import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  // Follow request status
  public type FollowRequestStatus = {
    #pending;
    #approved;
    #declined;
  };

  // A pending follow request from one user to another
  public type FollowRequest = {
    id : Nat;
    from : UserId;
    to : UserId;
    createdAt : Timestamp;
    status : FollowRequestStatus;
  };

  // A direct message between two users
  public type DirectMessage = {
    id : Nat;
    from : UserId;
    to : UserId;
    text : Text;
    createdAt : Timestamp;
    var readByRecipient : Bool;
  };

  // Public (shared) view of a direct message — no var fields
  public type DirectMessageView = {
    id : Nat;
    from : UserId;
    to : UserId;
    text : Text;
    createdAt : Timestamp;
    readByRecipient : Bool;
  };

  // Summary of a conversation with another user
  public type ConversationPreview = {
    partner : UserId;
    lastMessage : DirectMessageView;
    unreadCount : Nat;
  };
};
