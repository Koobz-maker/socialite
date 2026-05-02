import Time "mo:core/Time";
import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MessagingLib "../lib/messaging";
import SocialLib "../lib/social";
import SocialTypes "../types/social";
import Types "../types/messaging";

// Public API mixin for messaging and follow-requests domain.
// State slices injected: accessControlState, followRequests, messages,
// followers, following, nextFollowRequestId, nextMessageId.
mixin (
  accessControlState : AccessControl.AccessControlState,
  followRequests : MessagingLib.FollowRequestMap,
  messages : MessagingLib.MessageMap,
  followers : SocialLib.FollowMap,
  following : SocialLib.FollowMap,
  nextFollowRequestId : { var value : Nat },
  nextMessageId : { var value : Nat },
) {

  // ── Follow Requests ───────────────────────────────────────────────────

  /// Send a follow request to another user.
  /// Creates a pending FollowRequest rather than an immediate follow.
  public shared ({ caller }) func sendFollowRequest(to : Types.UserId) : async Bool {
    let now = Time.now();
    switch (MessagingLib.createFollowRequest(followRequests, caller, to, nextFollowRequestId, now)) {
      case (?_) true;
      case null false;
    };
  };

  /// Returns all pending follow requests received by the caller.
  public query ({ caller }) func getMyFollowRequests() : async [Types.FollowRequest] {
    MessagingLib.getPendingRequestsFor(followRequests, caller);
  };

  /// Returns the count of pending follow requests for the caller.
  public query ({ caller }) func getPendingRequestCount() : async Nat {
    MessagingLib.countPendingRequests(followRequests, caller);
  };

  /// Approve a follow request from the given requester to caller.
  /// Creates the real follow relationship on approval.
  public shared ({ caller }) func approveFollowRequest(requesterId : Types.UserId) : async Bool {
    switch (MessagingLib.approveRequestFrom(followRequests, requesterId, caller)) {
      case (?req) {
        // Wire up the real follow relationship: requester now follows caller
        ignore SocialLib.follow(followers, following, req.from, caller);
        true;
      };
      case null false;
    };
  };

  /// Decline (remove) a follow request from the given requester to caller.
  public shared ({ caller }) func declineFollowRequest(requesterId : Types.UserId) : async Bool {
    switch (MessagingLib.declineRequestFrom(followRequests, requesterId, caller)) {
      case (?_) true;
      case null false;
    };
  };

  /// Check the status of a follow request the caller sent to targetId.
  public query ({ caller }) func getRequestStatus(targetId : Types.UserId) : async ?Types.FollowRequestStatus {
    MessagingLib.getRequestStatus(followRequests, caller, targetId);
  };

  // ── Direct Messaging ──────────────────────────────────────────────────

  /// Send a direct message to another user.
  /// Only allowed when caller follows `to` OR `to` follows caller.
  public shared ({ caller }) func sendMessage(to : Types.UserId, text : Text) : async Bool {
    let now = Time.now();
    switch (MessagingLib.sendMessage(messages, followers, following, caller, to, text, nextMessageId, now)) {
      case (?_) true;
      case null false;
    };
  };

  /// Returns paginated message history between caller and the given user (oldest first).
  public query ({ caller }) func getConversation(withUser : Types.UserId, limit : Nat, offset : Nat) : async [Types.DirectMessageView] {
    MessagingLib.getConversation(messages, caller, withUser, limit, offset);
  };

  /// Returns a list of unique conversation partners with last message preview and unread count.
  public query ({ caller }) func listConversations() : async [Types.ConversationPreview] {
    MessagingLib.listConversations(messages, caller);
  };

  /// Returns the total number of unread messages for the caller.
  public query ({ caller }) func getUnreadMessageCount() : async Nat {
    MessagingLib.countUnreadMessages(messages, caller);
  };

  /// Marks all messages in the conversation with `partner` as read.
  public shared ({ caller }) func markConversationRead(partner : Types.UserId) : async () {
    MessagingLib.markConversationRead(messages, caller, partner);
  };
};
