import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import ProfileTypes "../types/profile";
import Common "../types/common";

module {
  public type ProfileMap = Map.Map<Common.UserId, ProfileTypes.ProfileInternal>;

  // Create a new profile in the map
  public func create(
    profiles : ProfileMap,
    principal : Common.UserId,
    input : ProfileTypes.ProfileInput,
    createdAt : Common.Timestamp,
  ) : ProfileTypes.ProfileInternal {
    let profile : ProfileTypes.ProfileInternal = {
      principal;
      var username = input.username;
      var displayName = input.displayName;
      var bio = input.bio;
      var avatarBlob = input.avatarBlob;
      var followerCount = 0;
      var followingCount = 0;
      var postCount = 0;
      createdAt;
    };
    profiles.add(principal, profile);
    profile;
  };

  // Get a profile by principal
  public func get(
    profiles : ProfileMap,
    principal : Common.UserId,
  ) : ?ProfileTypes.Profile {
    switch (profiles.get(principal)) {
      case (?p) ?toPublic(p);
      case null null;
    };
  };

  // Update caller's own profile
  public func update(
    profiles : ProfileMap,
    principal : Common.UserId,
    input : ProfileTypes.ProfileInput,
  ) {
    switch (profiles.get(principal)) {
      case (?p) {
        p.username := input.username;
        p.displayName := input.displayName;
        p.bio := input.bio;
        p.avatarBlob := input.avatarBlob;
      };
      case null Runtime.trap("Profile not found");
    };
  };

  // Convert internal profile to shared profile
  public func toPublic(internal : ProfileTypes.ProfileInternal) : ProfileTypes.Profile {
    {
      principal = internal.principal;
      username = internal.username;
      displayName = internal.displayName;
      bio = internal.bio;
      avatarBlob = internal.avatarBlob;
      followerCount = internal.followerCount;
      followingCount = internal.followingCount;
      postCount = internal.postCount;
      createdAt = internal.createdAt;
    };
  };

  // Check if a username is already taken
  public func isUsernameTaken(profiles : ProfileMap, username : Text) : Bool {
    profiles.any(func(_, p) { p.username == username });
  };

  // Increment follower count
  public func incrementFollowerCount(profiles : ProfileMap, principal : Common.UserId) {
    switch (profiles.get(principal)) {
      case (?p) p.followerCount += 1;
      case null {};
    };
  };

  // Decrement follower count
  public func decrementFollowerCount(profiles : ProfileMap, principal : Common.UserId) {
    switch (profiles.get(principal)) {
      case (?p) {
        if (p.followerCount > 0) p.followerCount -= 1;
      };
      case null {};
    };
  };

  // Increment following count
  public func incrementFollowingCount(profiles : ProfileMap, principal : Common.UserId) {
    switch (profiles.get(principal)) {
      case (?p) p.followingCount += 1;
      case null {};
    };
  };

  // Decrement following count
  public func decrementFollowingCount(profiles : ProfileMap, principal : Common.UserId) {
    switch (profiles.get(principal)) {
      case (?p) {
        if (p.followingCount > 0) p.followingCount -= 1;
      };
      case null {};
    };
  };

  // Increment post count
  public func incrementPostCount(profiles : ProfileMap, principal : Common.UserId) {
    switch (profiles.get(principal)) {
      case (?p) p.postCount += 1;
      case null {};
    };
  };

  // Decrement post count
  public func decrementPostCount(profiles : ProfileMap, principal : Common.UserId) {
    switch (profiles.get(principal)) {
      case (?p) {
        if (p.postCount > 0) p.postCount -= 1;
      };
      case null {};
    };
  };

  // Search profiles by username or displayName (case-insensitive)
  public func search(
    profiles : ProfileMap,
    queryText : Text,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<ProfileTypes.Profile> {
    let lowerQuery = queryText.toLower();
    let allMatches = profiles.entries()
      .filter(func((_, p)) {
        p.username.toLower().contains(#text lowerQuery) or
        p.displayName.toLower().contains(#text lowerQuery)
      })
      .map(func((_, p) : (Common.UserId, ProfileTypes.ProfileInternal)) : ProfileTypes.Profile { toPublic(p) })
      .toArray();

    let total = allMatches.size();
    let start = if (offset >= total) total else offset;
    let end_ = if (start + limit > total) total else start + limit;
    let items = allMatches.sliceToArray(start, end_);
    let nextOffset : ?Nat = if (end_ < total) ?(end_) else null;
    { items; nextOffset; total };
  };

  // Get suggested users (not followed by caller, sorted by followerCount desc)
  public func getSuggested(
    profiles : ProfileMap,
    excludePrincipal : Common.UserId,
    isFollowingFn : Common.UserId -> Bool,
    offset : Nat,
    limit : Nat,
  ) : Common.Page<ProfileTypes.Profile> {
    let candidates = profiles.entries()
      .filter(func((p, _)) {
        not Principal.equal(p, excludePrincipal) and not isFollowingFn(p)
      })
      .map(func((_, p) : (Common.UserId, ProfileTypes.ProfileInternal)) : ProfileTypes.Profile { toPublic(p) })
      .toArray()
      .sort(func(a : ProfileTypes.Profile, b : ProfileTypes.Profile) : Order.Order {
        if (a.followerCount > b.followerCount) #less
        else if (a.followerCount < b.followerCount) #greater
        else #equal
      });

    let total = candidates.size();
    let start = if (offset >= total) total else offset;
    let end_ = if (start + limit > total) total else start + limit;
    let items = candidates.sliceToArray(start, end_);
    let nextOffset : ?Nat = if (end_ < total) ?(end_) else null;
    { items; nextOffset; total };
  };
};
