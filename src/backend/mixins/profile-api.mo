import Map "mo:core/Map";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import ProfileLib "../lib/profile";
import ProfileTypes "../types/profile";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  profiles : ProfileLib.ProfileMap,
) {
  // Get the caller's own profile (as UserProfile for authorization extension)
  public query ({ caller }) func getCallerUserProfile() : async ?ProfileTypes.UserProfile {
    switch (profiles.get(caller)) {
      case (?p) ?{
        username = p.username;
        displayName = p.displayName;
        bio = p.bio;
        avatarBlob = p.avatarBlob;
      };
      case null null;
    };
  };

  // Save the caller's own profile (create or update) — required by authorization extension
  public shared ({ caller }) func saveCallerUserProfile(profile : ProfileTypes.UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (profiles.get(caller)) {
      case (?p) {
        p.username := profile.username;
        p.displayName := profile.displayName;
        p.bio := profile.bio;
        p.avatarBlob := profile.avatarBlob;
      };
      case null {
        ignore ProfileLib.create(profiles, caller, {
          username = profile.username;
          displayName = profile.displayName;
          bio = profile.bio;
          avatarBlob = profile.avatarBlob;
        }, Time.now());
      };
    };
  };

  // Get any user's public profile
  public query func getUserProfile(user : Common.UserId) : async ?ProfileTypes.Profile {
    ProfileLib.get(profiles, user);
  };

  // Get full profile with counts
  public query func getProfile(user : Common.UserId) : async ?ProfileTypes.Profile {
    ProfileLib.get(profiles, user);
  };

  // Get caller's full profile
  public query ({ caller }) func getCallerProfile() : async ?ProfileTypes.Profile {
    ProfileLib.get(profiles, caller);
  };

  // Update caller's profile
  public shared ({ caller }) func updateCallerProfile(input : ProfileTypes.ProfileInput) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (profiles.get(caller)) {
      case (?_) ProfileLib.update(profiles, caller, input);
      case null {
        ignore ProfileLib.create(profiles, caller, input, Time.now());
      };
    };
  };

  // Register user with a profile
  public shared ({ caller }) func registerUser(input : ProfileTypes.ProfileInput) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (profiles.get(caller)) {
      case (?_) ProfileLib.update(profiles, caller, input);
      case null {
        ignore ProfileLib.create(profiles, caller, input, Time.now());
      };
    };
  };

  // Search users by username or displayName
  public query func searchUsers(queryText : Text, offset : Nat, limit : Nat) : async Common.Page<ProfileTypes.Profile> {
    ProfileLib.search(profiles, queryText, offset, limit);
  };
};
