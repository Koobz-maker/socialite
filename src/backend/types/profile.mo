import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type UserId = Common.UserId;

  // Internal mutable profile stored in state
  public type ProfileInternal = {
    principal : UserId;
    var username : Text;
    var displayName : Text;
    var bio : Text;
    var avatarBlob : ?Storage.ExternalBlob;
    var followerCount : Nat;
    var followingCount : Nat;
    var postCount : Nat;
    createdAt : Common.Timestamp;
  };

  // Shared/public profile for API boundary
  public type Profile = {
    principal : UserId;
    username : Text;
    displayName : Text;
    bio : Text;
    avatarBlob : ?Storage.ExternalBlob;
    followerCount : Nat;
    followingCount : Nat;
    postCount : Nat;
    createdAt : Common.Timestamp;
  };

  // Input for profile creation/update
  public type ProfileInput = {
    username : Text;
    displayName : Text;
    bio : Text;
    avatarBlob : ?Storage.ExternalBlob;
  };

  // Required by extension-authorization
  public type UserProfile = {
    username : Text;
    displayName : Text;
    bio : Text;
    avatarBlob : ?Storage.ExternalBlob;
  };
};
