import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface DirectMessageView {
    id: bigint;
    to: UserId;
    from: UserId;
    createdAt: Timestamp;
    text: string;
    readByRecipient: boolean;
}
export type Timestamp = bigint;
export type CommentId = bigint;
export interface Comment {
    id: CommentId;
    createdAt: Timestamp;
    text: string;
    authorPrincipal: UserId;
    postId: PostId;
}
export type PostId = bigint;
export interface Page_2 {
    total: bigint;
    nextOffset?: bigint;
    items: Array<Comment>;
}
export interface Profile {
    bio: string;
    postCount: bigint;
    principal: UserId;
    username: string;
    displayName: string;
    avatarBlob?: ExternalBlob;
    createdAt: Timestamp;
    followerCount: bigint;
    followingCount: bigint;
}
export interface Page_1 {
    total: bigint;
    nextOffset?: bigint;
    items: Array<Post>;
}
export interface ConversationPreview {
    lastMessage: DirectMessageView;
    unreadCount: bigint;
    partner: UserId;
}
export type UserId = Principal;
export interface Page_3 {
    total: bigint;
    nextOffset?: bigint;
    items: Array<Notification>;
}
export interface Page {
    total: bigint;
    nextOffset?: bigint;
    items: Array<Profile>;
}
export interface Post {
    id: PostId;
    photoBlob?: ExternalBlob;
    likeCount: bigint;
    createdAt: Timestamp;
    caption: string;
    commentCount: bigint;
    authorPrincipal: UserId;
}
export type NotificationId = bigint;
export interface Notification {
    id: NotificationId;
    notifType: NotificationType;
    createdAt: Timestamp;
    read: boolean;
    fromPrincipal: UserId;
    postId?: PostId;
}
export interface FollowRequest {
    id: bigint;
    to: UserId;
    status: FollowRequestStatus;
    from: UserId;
    createdAt: Timestamp;
}
export interface PostInput {
    photoBlob?: ExternalBlob;
    caption: string;
}
export interface Page_4 {
    total: bigint;
    nextOffset?: bigint;
    items: Array<UserId>;
}
export interface ProfileInput {
    bio: string;
    username: string;
    displayName: string;
    avatarBlob?: ExternalBlob;
}
export interface UserProfile {
    bio: string;
    username: string;
    displayName: string;
    avatarBlob?: ExternalBlob;
}
export enum FollowRequestStatus {
    pending = "pending",
    approved = "approved",
    declined = "declined"
}
export enum NotificationType {
    like = "like",
    comment = "comment",
    newFollower = "newFollower"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(postId: PostId, text: string): Promise<Comment>;
    approveFollowRequest(requesterId: UserId): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(input: PostInput): Promise<Post>;
    declineFollowRequest(requesterId: UserId): Promise<boolean>;
    deleteComment(postId: PostId, commentId: CommentId): Promise<boolean>;
    deletePost(postId: PostId): Promise<boolean>;
    followUser(target: UserId): Promise<boolean>;
    getCallerProfile(): Promise<Profile | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConversation(withUser: UserId, limit: bigint, offset: bigint): Promise<Array<DirectMessageView>>;
    getExploreFeed(offset: bigint, limit: bigint): Promise<Page_1>;
    getFollowerProfiles(user: UserId, offset: bigint, limit: bigint): Promise<Page>;
    getFollowers(user: UserId, offset: bigint, limit: bigint): Promise<Page_4>;
    getFollowing(user: UserId, offset: bigint, limit: bigint): Promise<Page_4>;
    getFollowingProfiles(user: UserId, offset: bigint, limit: bigint): Promise<Page>;
    getHomeFeed(offset: bigint, limit: bigint): Promise<Page_1>;
    getMyFollowRequests(): Promise<Array<FollowRequest>>;
    getNotifications(offset: bigint, limit: bigint): Promise<Page_3>;
    getPendingRequestCount(): Promise<bigint>;
    getPost(postId: PostId): Promise<Post | null>;
    getProfile(user: UserId): Promise<Profile | null>;
    getRequestStatus(targetId: UserId): Promise<FollowRequestStatus | null>;
    getSuggestedUsersWithFollowing(offset: bigint, limit: bigint): Promise<Page>;
    getUnreadMessageCount(): Promise<bigint>;
    getUnreadNotificationCount(): Promise<bigint>;
    getUserProfile(user: UserId): Promise<Profile | null>;
    isCallerAdmin(): Promise<boolean>;
    isFollowing(target: UserId): Promise<boolean>;
    isLiked(postId: PostId): Promise<boolean>;
    listComments(postId: PostId, offset: bigint, limit: bigint): Promise<Page_2>;
    listConversations(): Promise<Array<ConversationPreview>>;
    listPostsByAuthor(author: UserId, offset: bigint, limit: bigint): Promise<Page_1>;
    markAllNotificationsRead(): Promise<void>;
    markConversationRead(partner: UserId): Promise<void>;
    markNotificationRead(notifId: NotificationId): Promise<boolean>;
    registerUser(input: ProfileInput): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchUsers(queryText: string, offset: bigint, limit: bigint): Promise<Page>;
    sendFollowRequest(to: UserId): Promise<boolean>;
    sendMessage(to: UserId, text: string): Promise<boolean>;
    toggleLike(postId: PostId): Promise<boolean>;
    unfollowUser(target: UserId): Promise<boolean>;
    updateCallerProfile(input: ProfileInput): Promise<void>;
    updateCaption(postId: PostId, newCaption: string): Promise<boolean>;
}
