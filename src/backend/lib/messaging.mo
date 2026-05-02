import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Types "../types/messaging";
import SocialLib "social";

module {
  public type UserId = Types.UserId;
  public type FollowRequest = Types.FollowRequest;
  public type DirectMessage = Types.DirectMessage;
  public type DirectMessageView = Types.DirectMessageView;
  public type ConversationPreview = Types.ConversationPreview;

  // Persistent maps for follow requests and messages
  public type FollowRequestMap = Map.Map<Nat, FollowRequest>;
  public type MessageMap = Map.Map<Nat, DirectMessage>;

  // ── Follow Request helpers ────────────────────────────────────────────

  // Create a new follow request; returns the request or null if one already exists
  public func createFollowRequest(
    requests : FollowRequestMap,
    from : UserId,
    to : UserId,
    nextId : { var value : Nat },
    now : Types.Timestamp,
  ) : ?FollowRequest {
    // Check for an existing pending request from this user to this target
    let existing = requests.values().find(func(r : FollowRequest) : Bool {
      Principal.equal(r.from, from) and Principal.equal(r.to, to) and r.status == #pending
    });
    switch (existing) {
      case (?_) null; // duplicate pending request — reject
      case null {
        let id = nextId.value;
        nextId.value += 1;
        let req : FollowRequest = { id; from; to; createdAt = now; status = #pending };
        requests.add(id, req);
        ?req;
      };
    };
  };

  // Get all pending requests addressed to the given user
  public func getPendingRequestsFor(
    requests : FollowRequestMap,
    userId : UserId,
  ) : [FollowRequest] {
    requests.values()
      .filter(func(r : FollowRequest) : Bool {
        Principal.equal(r.to, userId) and r.status == #pending
      })
      .toArray();
  };

  // Count pending requests for a user
  public func countPendingRequests(
    requests : FollowRequestMap,
    userId : UserId,
  ) : Nat {
    requests.values()
      .filter(func(r : FollowRequest) : Bool {
        Principal.equal(r.to, userId) and r.status == #pending
      })
      .size();
  };

  // Find a pending request from a specific requester to the target
  public func findPendingRequest(
    requests : FollowRequestMap,
    from : UserId,
    to : UserId,
  ) : ?FollowRequest {
    requests.values().find(func(r : FollowRequest) : Bool {
      Principal.equal(r.from, from) and Principal.equal(r.to, to) and r.status == #pending
    });
  };

  // Get the most recent request status from caller to target (any status)
  public func getRequestStatus(
    requests : FollowRequestMap,
    from : UserId,
    to : UserId,
  ) : ?Types.FollowRequestStatus {
    // Find the most recent request from `from` to `to`
    let matching = requests.values()
      .filter(func(r : FollowRequest) : Bool {
        Principal.equal(r.from, from) and Principal.equal(r.to, to)
      })
      .toArray();
    // Return the status of the most recently created request
    switch (matching.size()) {
      case 0 null;
      case _ {
        let latest = matching.foldLeft(
          matching[0],
          func(best : FollowRequest, r : FollowRequest) : FollowRequest {
            if (r.createdAt > best.createdAt) r else best
          },
        );
        ?latest.status;
      };
    };
  };

  // Approve a pending request from a specific requester to caller;
  // returns the updated request or null if not found / not authorised
  public func approveRequestFrom(
    requests : FollowRequestMap,
    requesterId : UserId,
    caller : UserId,
  ) : ?FollowRequest {
    switch (findPendingRequest(requests, requesterId, caller)) {
      case (?req) {
        let updated : FollowRequest = { req with status = #approved };
        requests.add(req.id, updated);
        ?updated;
      };
      case null null;
    };
  };

  // Decline a pending request from a specific requester to caller;
  // returns the updated request or null if not found / not authorised
  public func declineRequestFrom(
    requests : FollowRequestMap,
    requesterId : UserId,
    caller : UserId,
  ) : ?FollowRequest {
    switch (findPendingRequest(requests, requesterId, caller)) {
      case (?req) {
        let updated : FollowRequest = { req with status = #declined };
        requests.add(req.id, updated);
        ?updated;
      };
      case null null;
    };
  };

  // ── Direct Message helpers ────────────────────────────────────────────

  // Convert internal DirectMessage to the shared view type
  public func toView(msg : DirectMessage) : DirectMessageView {
    {
      id = msg.id;
      from = msg.from;
      to = msg.to;
      text = msg.text;
      createdAt = msg.createdAt;
      readByRecipient = msg.readByRecipient;
    };
  };

  // Check whether the two principals share a follow relationship in either direction
  public func canMessage(
    followers : SocialLib.FollowMap,
    following : SocialLib.FollowMap,
    a : UserId,
    b : UserId,
  ) : Bool {
    SocialLib.isFollowing(following, a, b) or SocialLib.isFollowing(following, b, a);
  };

  // Send a message; returns the new message or null when not allowed
  public func sendMessage(
    messages : MessageMap,
    followers : SocialLib.FollowMap,
    following : SocialLib.FollowMap,
    from : UserId,
    to : UserId,
    text : Text,
    nextId : { var value : Nat },
    now : Types.Timestamp,
  ) : ?DirectMessage {
    if (not canMessage(followers, following, from, to)) return null;
    let id = nextId.value;
    nextId.value += 1;
    let msg : DirectMessage = {
      id;
      from;
      to;
      text;
      createdAt = now;
      var readByRecipient = false;
    };
    messages.add(id, msg);
    ?msg;
  };

  // Return paginated messages in chronological order between two users
  public func getConversation(
    messages : MessageMap,
    a : UserId,
    b : UserId,
    limit : Nat,
    offset : Nat,
  ) : [DirectMessageView] {
    let msgs = messages.values()
      .filter(func(m : DirectMessage) : Bool {
        (Principal.equal(m.from, a) and Principal.equal(m.to, b)) or
        (Principal.equal(m.from, b) and Principal.equal(m.to, a))
      })
      .toArray();
    // Sort ascending by createdAt (oldest first)
    let sorted = msgs.sort(func(x : DirectMessage, y : DirectMessage) : { #less; #equal; #greater } {
      if (x.createdAt < y.createdAt) #less
      else if (x.createdAt > y.createdAt) #greater
      else #equal
    });
    let total = sorted.size();
    let start = if (offset >= total) total else offset;
    let end_ = if (start + limit > total) total else start + limit;
    let sliced = sorted.sliceToArray(start, end_);
    sliced.map<DirectMessage, DirectMessageView>(func(m) { toView(m) });
  };

  // Return a list of conversation previews for the caller, sorted newest-first
  public func listConversations(
    messages : MessageMap,
    caller : UserId,
  ) : [ConversationPreview] {
    // Collect all messages involving caller
    let myMsgs = messages.values()
      .filter(func(m : DirectMessage) : Bool {
        Principal.equal(m.from, caller) or Principal.equal(m.to, caller)
      })
      .toArray();

    // Build a map: partner -> (latestMsg, unreadCount)
    let partners = Map.empty<UserId, { latestMsg : DirectMessage; unreadCount : Nat }>();

    for (m in myMsgs.values()) {
      let partner : UserId = if (Principal.equal(m.from, caller)) m.to else m.from;
      let isUnread = Principal.equal(m.to, caller) and not m.readByRecipient;
      switch (partners.get(partner)) {
        case null {
          partners.add(partner, {
            latestMsg = m;
            unreadCount = if (isUnread) 1 else 0;
          });
        };
        case (?existing) {
          let newLatest = if (m.createdAt > existing.latestMsg.createdAt) m else existing.latestMsg;
          let newUnread = existing.unreadCount + (if (isUnread) 1 else 0);
          partners.add(partner, { latestMsg = newLatest; unreadCount = newUnread });
        };
      };
    };

    // Convert to array and sort newest-first
    let previews = partners.entries()
      .toArray()
      .map(
        func((partner, data)) {
          {
            partner;
            lastMessage = toView(data.latestMsg);
            unreadCount = data.unreadCount;
          }
        }
      );

    previews.sort(func(x : ConversationPreview, y : ConversationPreview) : { #less; #equal; #greater } {
      if (x.lastMessage.createdAt > y.lastMessage.createdAt) #less
      else if (x.lastMessage.createdAt < y.lastMessage.createdAt) #greater
      else #equal
    });
  };

  // Count total unread messages for caller
  public func countUnreadMessages(
    messages : MessageMap,
    caller : UserId,
  ) : Nat {
    messages.values()
      .filter(func(m : DirectMessage) : Bool {
        Principal.equal(m.to, caller) and not m.readByRecipient
      })
      .size();
  };

  // Mark all messages in a conversation as read
  public func markConversationRead(
    messages : MessageMap,
    caller : UserId,
    partner : UserId,
  ) : () {
    for ((_, msg) in messages.entries()) {
      if (Principal.equal(msg.to, caller) and Principal.equal(msg.from, partner)) {
        msg.readByRecipient := true;
      };
    };
  };
};
