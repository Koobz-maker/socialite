import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import SocialLib "../lib/social";
import PostLib "../lib/post";
import ProfileLib "../lib/profile";
import NotifLib "../lib/notification";
import SocialTypes "../types/social";
import ProfileTypes "../types/profile";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  comments : SocialLib.CommentMap,
  followers : SocialLib.FollowMap,
  following : SocialLib.FollowMap,
  profileMap : ProfileLib.ProfileMap,
  posts : PostLib.PostMap,
  notifs : NotifLib.NotifMap,
  nextCommentId : { var value : Nat },
  nextNotifId : { var value : Nat },
) {
  // Add a comment to a post
  public shared ({ caller }) func addComment(
    postId : Common.PostId,
    text : Text,
  ) : async SocialTypes.Comment {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let id = nextCommentId.value;
    nextCommentId.value += 1;
    let comment = SocialLib.addComment(comments, id, postId, caller, text, Time.now());
    PostLib.incrementCommentCount(posts, postId);

    // Notify post author if different from caller
    switch (PostLib.get(posts, postId)) {
      case (?post) {
        if (not Principal.equal(post.authorPrincipal, caller)) {
          let nid = nextNotifId.value;
          nextNotifId.value += 1;
          ignore NotifLib.add(notifs, nid, post.authorPrincipal, #comment, caller, ?postId, Time.now());
        };
      };
      case null {};
    };
    comment;
  };

  // Delete own comment
  public shared ({ caller }) func deleteComment(
    postId : Common.PostId,
    commentId : Common.CommentId,
  ) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let deleted = SocialLib.deleteComment(comments, postId, commentId, caller);
    if (deleted) PostLib.decrementCommentCount(posts, postId);
    deleted;
  };

  // List comments for a post (paginated)
  public query func listComments(
    postId : Common.PostId,
    offset : Nat,
    limit : Nat,
  ) : async Common.Page<SocialTypes.Comment> {
    SocialLib.listComments(comments, postId, offset, limit);
  };

  // Follow a user
  public shared ({ caller }) func followUser(target : Common.UserId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    if (Principal.equal(caller, target)) Runtime.trap("Cannot follow yourself");
    let followed = SocialLib.follow(followers, following, caller, target);
    if (followed) {
      ProfileLib.incrementFollowerCount(profileMap, target);
      ProfileLib.incrementFollowingCount(profileMap, caller);
      // Notify target user
      let nid = nextNotifId.value;
      nextNotifId.value += 1;
      ignore NotifLib.add(notifs, nid, target, #newFollower, caller, null, Time.now());
    };
    followed;
  };

  // Unfollow a user
  public shared ({ caller }) func unfollowUser(target : Common.UserId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let unfollowed = SocialLib.unfollow(followers, following, caller, target);
    if (unfollowed) {
      ProfileLib.decrementFollowerCount(profileMap, target);
      ProfileLib.decrementFollowingCount(profileMap, caller);
    };
    unfollowed;
  };

  // Check if caller is following a user
  public query ({ caller }) func isFollowing(target : Common.UserId) : async Bool {
    SocialLib.isFollowing(following, caller, target);
  };

  // Get followers of a user (paginated) — returns UserId list
  public query func getFollowers(
    user : Common.UserId,
    offset : Nat,
    limit : Nat,
  ) : async Common.Page<Common.UserId> {
    SocialLib.getFollowers(followers, user, offset, limit);
  };

  // Get users that a user is following (paginated) — returns UserId list
  public query func getFollowing(
    user : Common.UserId,
    offset : Nat,
    limit : Nat,
  ) : async Common.Page<Common.UserId> {
    SocialLib.getFollowing(following, user, offset, limit);
  };

  // Get followers of a user as Profile objects (paginated)
  public query func getFollowerProfiles(
    user : Common.UserId,
    offset : Nat,
    limit : Nat,
  ) : async Common.Page<ProfileTypes.Profile> {
    let ids = SocialLib.getFollowers(followers, user, offset, limit);
    let profiles = ids.items
      .filterMap(func(p : Common.UserId) : ?ProfileTypes.Profile { ProfileLib.get(profileMap, p) });
    { items = profiles; nextOffset = ids.nextOffset; total = ids.total };
  };

  // Get following of a user as Profile objects (paginated)
  public query func getFollowingProfiles(
    user : Common.UserId,
    offset : Nat,
    limit : Nat,
  ) : async Common.Page<ProfileTypes.Profile> {
    let ids = SocialLib.getFollowing(following, user, offset, limit);
    let profiles = ids.items
      .filterMap(func(p : Common.UserId) : ?ProfileTypes.Profile { ProfileLib.get(profileMap, p) });
    { items = profiles; nextOffset = ids.nextOffset; total = ids.total };
  };

  // Get suggested users to follow (not followed, ranked by follower count)
  public query ({ caller }) func getSuggestedUsersWithFollowing(offset : Nat, limit : Nat) : async Common.Page<ProfileTypes.Profile> {
    ProfileLib.getSuggested(
      profileMap,
      caller,
      func(p) { SocialLib.isFollowing(following, caller, p) },
      offset,
      limit,
    );
  };
};
