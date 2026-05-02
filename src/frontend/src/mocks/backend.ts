import type { backendInterface } from "../backend";
import { NotificationType, UserRole } from "../backend";
import type {
  _ImmutableObjectStorageCreateCertificateResult,
  _ImmutableObjectStorageRefillResult,
} from "../backend";
import { Principal } from "@icp-sdk/core/principal";

const samplePrincipal = Principal.fromText("aaaaa-aa");
const samplePrincipal2 = Principal.fromText("2vxsx-fae");

const samplePost1 = {
  id: BigInt(1),
  caption: "Golden hour in the city 🌇 Loving every moment of this view!",
  likeCount: BigInt(142),
  commentCount: BigInt(18),
  createdAt: BigInt(Date.now() - 3600000) * BigInt(1000000),
  authorPrincipal: samplePrincipal,
  photoBlob: undefined,
};

const samplePost2 = {
  id: BigInt(2),
  caption: "Just launched my new project! Been working on this for months. So excited to share it with everyone. 🚀",
  likeCount: BigInt(87),
  commentCount: BigInt(34),
  createdAt: BigInt(Date.now() - 7200000) * BigInt(1000000),
  authorPrincipal: samplePrincipal2,
  photoBlob: undefined,
};

const samplePost3 = {
  id: BigInt(3),
  caption: "Morning coffee and good vibes ☕ Ready to take on the day!",
  likeCount: BigInt(56),
  commentCount: BigInt(9),
  createdAt: BigInt(Date.now() - 14400000) * BigInt(1000000),
  authorPrincipal: samplePrincipal,
  photoBlob: undefined,
};

const sampleComment = {
  id: BigInt(1),
  text: "This is absolutely stunning! 😍",
  postId: BigInt(1),
  authorPrincipal: samplePrincipal2,
  createdAt: BigInt(Date.now() - 1800000) * BigInt(1000000),
};

const sampleNotification1 = {
  id: BigInt(1),
  notifType: NotificationType.like,
  createdAt: BigInt(Date.now() - 600000) * BigInt(1000000),
  read: false,
  fromPrincipal: samplePrincipal2,
  postId: BigInt(1),
};

const sampleNotification2 = {
  id: BigInt(2),
  notifType: NotificationType.newFollower,
  createdAt: BigInt(Date.now() - 3600000) * BigInt(1000000),
  read: false,
  fromPrincipal: samplePrincipal2,
  postId: undefined,
};

const sampleNotification3 = {
  id: BigInt(3),
  notifType: NotificationType.comment,
  createdAt: BigInt(Date.now() - 7200000) * BigInt(1000000),
  read: true,
  fromPrincipal: samplePrincipal,
  postId: BigInt(2),
};

export const mockBackend: backendInterface = {
  addComment: async (_postId, text) => ({
    id: BigInt(99),
    text,
    postId: _postId,
    authorPrincipal: samplePrincipal,
    createdAt: BigInt(Date.now()) * BigInt(1000000),
  }),

  assignCallerUserRole: async () => undefined,

  createPost: async (input) => ({
    id: BigInt(99),
    caption: input.caption,
    likeCount: BigInt(0),
    commentCount: BigInt(0),
    createdAt: BigInt(Date.now()) * BigInt(1000000),
    authorPrincipal: samplePrincipal,
    photoBlob: undefined,
  }),

  deleteComment: async () => true,
  deletePost: async () => true,
  followUser: async () => true,

  getCallerProfile: async () => ({
    bio: "Building cool things on the Internet Computer 🛠️",
    principal: samplePrincipal,
    username: "alex_creates",
    displayName: "Alex Creates",
    avatarBlob: undefined,
    createdAt: BigInt(Date.now() - 86400000 * 7) * BigInt(1000000),
    postCount: BigInt(12),
    followerCount: BigInt(342),
    followingCount: BigInt(87),
  }),

  getCallerUserProfile: async () => ({
    bio: "Building cool things on the Internet Computer 🛠️",
    username: "alex_creates",
    displayName: "Alex Creates",
    avatarBlob: undefined,
  }),

  getCallerUserRole: async () => UserRole.user,

  getExploreFeed: async () => ({
    total: BigInt(3),
    nextOffset: undefined,
    items: [samplePost1, samplePost2, samplePost3],
  }),

  getFollowers: async () => ({
    total: BigInt(2),
    nextOffset: undefined,
    items: [samplePrincipal, samplePrincipal2],
  }),

  getFollowerProfiles: async () => ({
    total: BigInt(0),
    nextOffset: undefined,
    items: [],
  }),

  getFollowing: async () => ({
    total: BigInt(2),
    nextOffset: undefined,
    items: [samplePrincipal2, samplePrincipal],
  }),

  getFollowingProfiles: async () => ({
    total: BigInt(0),
    nextOffset: undefined,
    items: [],
  }),

  getHomeFeed: async () => ({
    total: BigInt(3),
    nextOffset: undefined,
    items: [samplePost1, samplePost2, samplePost3],
  }),

  getNotifications: async () => ({
    total: BigInt(3),
    nextOffset: undefined,
    items: [sampleNotification1, sampleNotification2, sampleNotification3],
  }),

  getPost: async () => samplePost1,

  getProfile: async () => ({
    bio: "Travel enthusiast & coffee addict ☕ | Photographer | Based in SF",
    principal: samplePrincipal2,
    username: "jamie_photos",
    displayName: "Jamie Photos",
    avatarBlob: undefined,
    createdAt: BigInt(Date.now() - 86400000 * 30) * BigInt(1000000),
    postCount: BigInt(24),
    followerCount: BigInt(1842),
    followingCount: BigInt(312),
  }),

  getUnreadNotificationCount: async () => BigInt(2),

  getSuggestedUsersWithFollowing: async () => ({
    total: BigInt(0),
    nextOffset: undefined,
    items: [],
  }),

  getUserProfile: async () => ({
    bio: "Travel enthusiast & coffee addict ☕ | Photographer | Based in SF",
    principal: samplePrincipal2,
    username: "jamie_photos",
    displayName: "Jamie Photos",
    avatarBlob: undefined,
    createdAt: BigInt(Date.now() - 86400000 * 30) * BigInt(1000000),
    postCount: BigInt(24),
    followerCount: BigInt(1842),
    followingCount: BigInt(312),
  }),

  isCallerAdmin: async () => false,
  isFollowing: async () => false,
  isLiked: async () => false,

  listComments: async () => ({
    total: BigInt(1),
    nextOffset: undefined,
    items: [sampleComment],
  }),

  listPostsByAuthor: async () => ({
    total: BigInt(3),
    nextOffset: undefined,
    items: [samplePost1, samplePost2, samplePost3],
  }),

  markAllNotificationsRead: async () => undefined,
  markNotificationRead: async () => true,
  registerUser: async () => undefined,
  saveCallerUserProfile: async () => undefined,
  searchUsers: async () => ({ total: BigInt(0), nextOffset: undefined, items: [] }),
  toggleLike: async () => true,
  unfollowUser: async () => true,
  updateCallerProfile: async () => undefined,
  updateCaption: async () => true,

  // Messaging & follow requests stubs
  approveFollowRequest: async () => true,
  declineFollowRequest: async () => true,
  getMyFollowRequests: async () => [],
  getPendingRequestCount: async () => BigInt(0),
  getRequestStatus: async () => null,
  sendFollowRequest: async () => true,
  sendMessage: async () => true,
  getConversation: async () => [],
  listConversations: async () => [],
  getUnreadMessageCount: async () => BigInt(0),
  markConversationRead: async () => undefined,

  // Object storage stubs (required by backendInterface)
  _immutableObjectStorageBlobsAreLive: async () => [],
  _immutableObjectStorageBlobsToDelete: async () => [],
  _immutableObjectStorageConfirmBlobDeletion: async () => undefined,
  _immutableObjectStorageCreateCertificate: async (): Promise<_ImmutableObjectStorageCreateCertificateResult> => ({
    method: "",
    blob_hash: "",
  }),
  _immutableObjectStorageRefillCashier: async (): Promise<_ImmutableObjectStorageRefillResult> => ({
    success: false,
    topped_up_amount: BigInt(0),
  }),
  _immutableObjectStorageUpdateGatewayPrincipals: async () => undefined,
  _initializeAccessControl: async () => undefined,
};
