import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import ProfileLib "lib/profile";
import PostLib "lib/post";
import SocialLib "lib/social";
import NotifLib "lib/notification";
import MessagingLib "lib/messaging";
import Common "types/common";
import ProfileMixin "mixins/profile-api";
import PostMixin "mixins/post-api";
import SocialMixin "mixins/social-api";
import NotifMixin "mixins/notification-api";
import MessagingMixin "mixins/messaging-api";

actor {
  // Authorization state (must be first)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Object storage infrastructure
  include MixinObjectStorage();

  // Domain state
  let profiles : ProfileLib.ProfileMap = Map.empty();
  let posts : PostLib.PostMap = Map.empty();
  let likes : PostLib.LikeMap = Map.empty();
  let comments : SocialLib.CommentMap = Map.empty();
  let followers : SocialLib.FollowMap = Map.empty();
  let following : SocialLib.FollowMap = Map.empty();
  let notifs : NotifLib.NotifMap = Map.empty();

  // Messaging state
  let followRequests : MessagingLib.FollowRequestMap = Map.empty();
  let messages : MessagingLib.MessageMap = Map.empty();

  // Monotonic ID counters (wrapped in var-record for mixin injection)
  var nextPostIdVal : Nat = 0;
  var nextCommentIdVal : Nat = 0;
  var nextNotifIdVal : Nat = 0;
  var nextFollowRequestIdVal : Nat = 0;
  var nextMessageIdVal : Nat = 0;

  let nextPostId = { var value = nextPostIdVal };
  let nextCommentId = { var value = nextCommentIdVal };
  let nextNotifId = { var value = nextNotifIdVal };
  let nextFollowRequestId = { var value = nextFollowRequestIdVal };
  let nextMessageId = { var value = nextMessageIdVal };

  // Mixin inclusions
  include ProfileMixin(accessControlState, profiles);
  include PostMixin(accessControlState, posts, likes, profiles, following, notifs, nextPostId, nextNotifId);
  include SocialMixin(accessControlState, comments, followers, following, profiles, posts, notifs, nextCommentId, nextNotifId);
  include NotifMixin(accessControlState, notifs);
  include MessagingMixin(accessControlState, followRequests, messages, followers, following, nextFollowRequestId, nextMessageId);
};
