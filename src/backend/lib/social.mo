import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import SocialTypes "../types/social";
import Common "../types/common";

module {
  public type CommentMap = Map.Map<Common.PostId, List.List<SocialTypes.Comment>>;
  public type FollowMap = Map.Map<Common.UserId, Set.Set<Common.UserId>>;

  // Add a comment to a post
  public func addComment(
    comments : CommentMap,
    nextId : Nat,
    postId : Common.PostId,
    author : Common.UserId,
    text : Text,
    createdAt : Common.Timestamp,
  ) : SocialTypes.Comment {
    let comment : SocialTypes.Comment = {
      id = nextId;
      postId;
      authorPrincipal = author;
      text;
      createdAt;
    };

    let list = switch (comments.get(postId)) {
      case (?l) l;
      case null {
        let l = List.empty<SocialTypes.Comment>();
        comments.add(postId, l);
        l;
      };
    };
    list.add(comment);
    comment;
  };

  // Delete a comment (returns true if deleted, false if not found or unauthorized)
  public func deleteComment(
    comments : CommentMap,
    postId : Common.PostId,
    commentId : Common.CommentId,
    caller : Common.UserId,
  ) : Bool {
    switch (comments.get(postId)) {
      case (?list) {
        let before = list.size();
        let filtered = list.filter(func(c : SocialTypes.Comment) : Bool {
          not (c.id == commentId and Principal.equal(c.authorPrincipal, caller))
        });
        if (filtered.size() < before) {
          // Replace in-place by clearing and re-adding
          list.clear();
          list.append(filtered);
          true;
        } else {
          false;
        };
      };
      case null false;
    };
  };

  // List comments for a post (paginated, oldest first)
  public func listComments(
    comments : CommentMap,
    postId : Common.PostId,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<SocialTypes.Comment> {
    let all = switch (comments.get(postId)) {
      case (?list) list.toArray();
      case null [];
    };
    let total = all.size();
    let start = if (offset >= total) total else offset;
    let end_ = if (start + limit > total) total else start + limit;
    let items = all.sliceToArray(start, end_);
    let nextOffset : ?Nat = if (end_ < total) ?(end_) else null;
    { items; nextOffset; total };
  };

  // Follow a user (returns true if newly followed, false if already following)
  public func follow(
    followers : FollowMap,
    following : FollowMap,
    followerPrincipal : Common.UserId,
    targetPrincipal : Common.UserId,
  ) : Bool {
    let followerSet = switch (following.get(followerPrincipal)) {
      case (?s) s;
      case null {
        let s = Set.empty<Common.UserId>();
        following.add(followerPrincipal, s);
        s;
      };
    };

    if (followerSet.contains(targetPrincipal)) return false;

    followerSet.add(targetPrincipal);

    let targetFollowers = switch (followers.get(targetPrincipal)) {
      case (?s) s;
      case null {
        let s = Set.empty<Common.UserId>();
        followers.add(targetPrincipal, s);
        s;
      };
    };
    targetFollowers.add(followerPrincipal);
    true;
  };

  // Unfollow a user (returns true if unfollowed, false if was not following)
  public func unfollow(
    followers : FollowMap,
    following : FollowMap,
    followerPrincipal : Common.UserId,
    targetPrincipal : Common.UserId,
  ) : Bool {
    switch (following.get(followerPrincipal)) {
      case (?followerSet) {
        if (not followerSet.contains(targetPrincipal)) return false;
        followerSet.remove(targetPrincipal);
        switch (followers.get(targetPrincipal)) {
          case (?targetSet) targetSet.remove(followerPrincipal);
          case null {};
        };
        true;
      };
      case null false;
    };
  };

  // Check if followerPrincipal is following targetPrincipal
  public func isFollowing(
    following : FollowMap,
    followerPrincipal : Common.UserId,
    targetPrincipal : Common.UserId,
  ) : Bool {
    switch (following.get(followerPrincipal)) {
      case (?s) s.contains(targetPrincipal);
      case null false;
    };
  };

  // Get followers list (paginated)
  public func getFollowers(
    followers : FollowMap,
    principal : Common.UserId,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<Common.UserId> {
    let all = switch (followers.get(principal)) {
      case (?s) s.toArray();
      case null [];
    };
    let total = all.size();
    let start = if (offset >= total) total else offset;
    let end_ = if (start + limit > total) total else start + limit;
    let items = all.sliceToArray(start, end_);
    let nextOffset : ?Nat = if (end_ < total) ?(end_) else null;
    { items; nextOffset; total };
  };

  // Get following list (paginated)
  public func getFollowing(
    following : FollowMap,
    principal : Common.UserId,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<Common.UserId> {
    let all = switch (following.get(principal)) {
      case (?s) s.toArray();
      case null [];
    };
    let total = all.size();
    let start = if (offset >= total) total else offset;
    let end_ = if (start + limit > total) total else start + limit;
    let items = all.sliceToArray(start, end_);
    let nextOffset : ?Nat = if (end_ < total) ?(end_) else null;
    { items; nextOffset; total };
  };

  // Get the following set for a user (for home feed filtering)
  public func getFollowingSet(
    following : FollowMap,
    principal : Common.UserId,
  ) : Set.Set<Common.UserId> {
    switch (following.get(principal)) {
      case (?s) s;
      case null Set.empty<Common.UserId>();
    };
  };
};
