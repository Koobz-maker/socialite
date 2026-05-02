import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import PostTypes "../types/post";
import Common "../types/common";

module {
  public type PostMap = Map.Map<Common.PostId, PostTypes.PostInternal>;
  public type LikeMap = Map.Map<Common.PostId, Set.Set<Common.UserId>>;

  // 7 days in nanoseconds
  let sevenDaysNs : Int = 604_800_000_000_000;

  // Create a new post
  public func create(
    posts : PostMap,
    nextId : Nat,
    authorPrincipal : Common.UserId,
    input : PostTypes.PostInput,
    createdAt : Common.Timestamp,
  ) : PostTypes.PostInternal {
    let post : PostTypes.PostInternal = {
      id = nextId;
      authorPrincipal;
      var caption = input.caption;
      var photoBlob = input.photoBlob;
      var likeCount = 0;
      var commentCount = 0;
      createdAt;
    };
    posts.add(nextId, post);
    post;
  };

  // Delete a post (returns true if deleted, false if not found or unauthorized)
  public func delete(
    posts : PostMap,
    likes : LikeMap,
    postId : Common.PostId,
    caller : Common.UserId,
  ) : Bool {
    switch (posts.get(postId)) {
      case (?post) {
        if (not Principal.equal(post.authorPrincipal, caller)) return false;
        posts.remove(postId);
        likes.remove(postId);
        true;
      };
      case null false;
    };
  };

  // Get a single post
  public func get(posts : PostMap, postId : Common.PostId) : ?PostTypes.Post {
    switch (posts.get(postId)) {
      case (?p) ?toPublic(p);
      case null null;
    };
  };

  // Convert internal post to shared post
  public func toPublic(internal : PostTypes.PostInternal) : PostTypes.Post {
    {
      id = internal.id;
      authorPrincipal = internal.authorPrincipal;
      caption = internal.caption;
      photoBlob = internal.photoBlob;
      likeCount = internal.likeCount;
      commentCount = internal.commentCount;
      createdAt = internal.createdAt;
    };
  };

  // List posts by author (paginated, newest first)
  public func listByAuthor(
    posts : PostMap,
    author : Common.UserId,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<PostTypes.Post> {
    let authorPosts = posts.entries()
      .filter(func((_, p)) { Principal.equal(p.authorPrincipal, author) })
      .map(func((_, p) : (Common.PostId, PostTypes.PostInternal)) : PostTypes.Post { toPublic(p) })
      .toArray()
      .sort(func(a : PostTypes.Post, b : PostTypes.Post) : Order.Order { Int.compare(b.createdAt, a.createdAt) });

    paginate(authorPosts, offset, limit);
  };

  // Paginated home feed (posts from followed users)
  public func homeFeed(
    posts : PostMap,
    following : Set.Set<Common.UserId>,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<PostTypes.Post> {
    let feedPosts = posts.entries()
      .filter(func((_, p)) { following.contains(p.authorPrincipal) })
      .map(func((_, p) : (Common.PostId, PostTypes.PostInternal)) : PostTypes.Post { toPublic(p) })
      .toArray()
      .sort(func(a : PostTypes.Post, b : PostTypes.Post) : Order.Order { Int.compare(b.createdAt, a.createdAt) });

    paginate(feedPosts, offset, limit);
  };

  // Trending/explore feed: rank by (likeCount + commentCount * 2) within last 7 days
  public func exploreFeed(
    posts : PostMap,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<PostTypes.Post> {
    let now = Time.now();
    let cutoff = now - sevenDaysNs;

    let trendingPosts = posts.entries()
      .filter(func((_, p)) { p.createdAt >= cutoff })
      .map(func((_, p) : (Common.PostId, PostTypes.PostInternal)) : PostTypes.Post { toPublic(p) })
      .toArray()
      .sort(func(a : PostTypes.Post, b : PostTypes.Post) : Order.Order {
        let scoreA = a.likeCount + a.commentCount * 2;
        let scoreB = b.likeCount + b.commentCount * 2;
        if (scoreA > scoreB) #less
        else if (scoreA < scoreB) #greater
        else Int.compare(b.createdAt, a.createdAt)
      });

    paginate(trendingPosts, offset, limit);
  };

  // Toggle like — returns new like state (true = liked)
  public func toggleLike(
    posts : PostMap,
    likes : LikeMap,
    postId : Common.PostId,
    caller : Common.UserId,
  ) : Bool {
    let likeSet = switch (likes.get(postId)) {
      case (?s) s;
      case null {
        let s = Set.empty<Common.UserId>();
        likes.add(postId, s);
        s;
      };
    };

    if (likeSet.contains(caller)) {
      likeSet.remove(caller);
      switch (posts.get(postId)) {
        case (?p) { if (p.likeCount > 0) p.likeCount -= 1 };
        case null {};
      };
      false;
    } else {
      likeSet.add(caller);
      switch (posts.get(postId)) {
        case (?p) p.likeCount += 1;
        case null {};
      };
      true;
    };
  };

  // Check if caller liked a post
  public func isLiked(
    likes : LikeMap,
    postId : Common.PostId,
    caller : Common.UserId,
  ) : Bool {
    switch (likes.get(postId)) {
      case (?s) s.contains(caller);
      case null false;
    };
  };

  // Increment comment count
  public func incrementCommentCount(posts : PostMap, postId : Common.PostId) {
    switch (posts.get(postId)) {
      case (?p) p.commentCount += 1;
      case null {};
    };
  };

  // Decrement comment count
  public func decrementCommentCount(posts : PostMap, postId : Common.PostId) {
    switch (posts.get(postId)) {
      case (?p) { if (p.commentCount > 0) p.commentCount -= 1 };
      case null {};
    };
  };

  // Update caption
  public func updateCaption(posts : PostMap, postId : Common.PostId, caller : Common.UserId, newCaption : Text) : Bool {
    switch (posts.get(postId)) {
      case (?p) {
        if (not Principal.equal(p.authorPrincipal, caller)) return false;
        p.caption := newCaption;
        true;
      };
      case null false;
    };
  };

  // Helper: paginate a sorted array
  func paginate<T>(arr : [T], offset : Nat, limit : Nat) : Common.Page<T> {
    let total = arr.size();
    let start = if (offset >= total) total else offset;
    let end_ = if (start + limit > total) total else start + limit;
    let items = arr.sliceToArray(start, end_);
    let nextOffset : ?Nat = if (end_ < total) ?(end_) else null;
    { items; nextOffset; total };
  };
};
