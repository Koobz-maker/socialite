import type {
  ExternalBlob,
  FollowRequestStatus,
  NotificationType,
} from "@/backend";
import type { Principal } from "@icp-sdk/core/principal";

export type { NotificationType } from "@/backend";
export type { ExternalBlob } from "@/backend";
export type { FollowRequestStatus } from "@/backend";

export type UserId = Principal;
export type PostId = bigint;
export type CommentId = bigint;
export type NotificationId = bigint;
export type Timestamp = bigint;

export interface User {
  principal: UserId;
  username: string;
  displayName: string;
  bio: string;
  avatarBlob?: ExternalBlob;
  followerCount: bigint;
  followingCount: bigint;
  postCount: bigint;
  createdAt: Timestamp;
}

export interface Post {
  id: PostId;
  authorPrincipal: UserId;
  caption: string;
  photoBlob?: ExternalBlob;
  likeCount: bigint;
  commentCount: bigint;
  createdAt: Timestamp;
}

export interface Comment {
  id: CommentId;
  postId: PostId;
  authorPrincipal: UserId;
  text: string;
  createdAt: Timestamp;
}

export interface Notification {
  id: NotificationId;
  notifType: NotificationType;
  fromPrincipal: UserId;
  postId?: PostId;
  read: boolean;
  createdAt: Timestamp;
}

export interface Page<T> {
  total: bigint;
  nextOffset?: bigint;
  items: T[];
}

export interface UserProfile {
  bio: string;
  username: string;
  displayName: string;
  avatarBlob?: ExternalBlob;
}

export interface FollowRequest {
  id: bigint;
  from: UserId;
  to: UserId;
  createdAt: Timestamp;
  status: FollowRequestStatus;
}

export interface DirectMessage {
  id: bigint;
  from: UserId;
  to: UserId;
  text: string;
  createdAt: Timestamp;
  readByRecipient: boolean;
}

export interface ConversationPreview {
  partner: UserId;
  lastMessage: DirectMessage;
  unreadCount: bigint;
}
