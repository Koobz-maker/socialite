import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type PostId = Common.PostId;
  public type UserId = Common.UserId;

  // Internal mutable post stored in state
  public type PostInternal = {
    id : PostId;
    authorPrincipal : UserId;
    var caption : Text;
    var photoBlob : ?Storage.ExternalBlob;
    var likeCount : Nat;
    var commentCount : Nat;
    createdAt : Common.Timestamp;
  };

  // Shared/public post for API boundary
  public type Post = {
    id : PostId;
    authorPrincipal : UserId;
    caption : Text;
    photoBlob : ?Storage.ExternalBlob;
    likeCount : Nat;
    commentCount : Nat;
    createdAt : Common.Timestamp;
  };

  // Input for post creation
  public type PostInput = {
    caption : Text;
    photoBlob : ?Storage.ExternalBlob;
  };
};
