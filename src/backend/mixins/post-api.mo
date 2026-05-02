import Map "mo:core/Map";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import PostLib "../lib/post";
import SocialLib "../lib/social";
import ProfileLib "../lib/profile";
import NotifLib "../lib/notification";
import PostTypes "../types/post";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  posts : PostLib.PostMap,
  likes : PostLib.LikeMap,
  profileMap : ProfileLib.ProfileMap,
  followingMap : SocialLib.FollowMap,
  notifs : NotifLib.NotifMap,
  nextPostId : { var value : Nat },
  nextNotifId : { var value : Nat },
) {
  // Create a new post
  public shared ({ caller }) func createPost(input : PostTypes.PostInput) : async PostTypes.Post {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let id = nextPostId.value;
    nextPostId.value += 1;
    let internal = PostLib.create(posts, id, caller, input, Time.now());
    ProfileLib.incrementPostCount(profileMap, caller);
    PostLib.toPublic(internal);
  };

  // Delete own post
  public shared ({ caller }) func deletePost(postId : Common.PostId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let deleted = PostLib.delete(posts, likes, postId, caller);
    if (deleted) ProfileLib.decrementPostCount(profileMap, caller);
    deleted;
  };

  // Get a single post by ID
  public query func getPost(postId : Common.PostId) : async ?PostTypes.Post {
    PostLib.get(posts, postId);
  };

  // List posts by a specific author (paginated)
  public query func listPostsByAuthor(
    author : Common.UserId,
    offset : Nat,
    limit : Nat,
  ) : async Common.Page<PostTypes.Post> {
    PostLib.listByAuthor(posts, author, offset, limit);
  };

  // Paginated home feed (posts from followed users + own posts)
  public query ({ caller }) func getHomeFeed(offset : Nat, limit : Nat) : async Common.Page<PostTypes.Post> {
    let followingSet = SocialLib.getFollowingSet(followingMap, caller);
    // Include caller's own posts in home feed
    let withSelf = followingSet.clone();
    withSelf.add(caller);
    PostLib.homeFeed(posts, withSelf, offset, limit);
  };

  // Trending/explore feed
  public query func getExploreFeed(offset : Nat, limit : Nat) : async Common.Page<PostTypes.Post> {
    PostLib.exploreFeed(posts, offset, limit);
  };

  // Toggle like on a post — also creates a like notification
  public shared ({ caller }) func toggleLike(postId : Common.PostId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let isNowLiked = PostLib.toggleLike(posts, likes, postId, caller);
    // If newly liked, notify post author
    if (isNowLiked) {
      switch (PostLib.get(posts, postId)) {
        case (?post) {
          if (not Principal.equal(post.authorPrincipal, caller)) {
            let nid = nextNotifId.value;
            nextNotifId.value += 1;
            ignore NotifLib.add(notifs, nid, post.authorPrincipal, #like, caller, ?postId, Time.now());
          };
        };
        case null {};
      };
    };
    isNowLiked;
  };

  // Check if the caller liked a post
  public query ({ caller }) func isLiked(postId : Common.PostId) : async Bool {
    PostLib.isLiked(likes, postId, caller);
  };

  // Update caption of own post
  public shared ({ caller }) func updateCaption(postId : Common.PostId, newCaption : Text) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    PostLib.updateCaption(posts, postId, caller, newCaption);
  };
};
