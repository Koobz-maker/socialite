import { createActor } from "@/backend";
import type { ConversationPreview, Profile } from "@/backend";
import { AvatarImage } from "@/components/AvatarImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, MessageSquarePlus, PenSquare } from "lucide-react";
import { useEffect, useState } from "react";

// ─── Conversation Skeleton ────────────────────────────────────────────────────

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-3 w-12" />
    </div>
  );
}

// ─── Conversation Item ────────────────────────────────────────────────────────

function ConversationItem({
  conversation,
  index,
}: {
  conversation: ConversationPreview;
  index: number;
}) {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const partnerPrincipal = conversation.partner.toString();

  const { data: profile } = useQuery<Profile | null>({
    queryKey: ["profile", partnerPrincipal],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(conversation.partner);
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  const unread = Number(conversation.unreadCount);
  const timeAgo = formatDistanceToNow(
    new Date(Number(conversation.lastMessage.createdAt / 1_000_000n)),
    { addSuffix: true },
  );

  return (
    <button
      type="button"
      data-ocid={`chat.conversation_item.${index + 1}`}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left cursor-pointer"
      onClick={() => profile && navigate({ to: `/chat/${profile.username}` })}
    >
      {profile ? (
        <AvatarImage
          blob={profile.avatarBlob}
          displayName={profile.displayName}
          username={profile.username}
          size="md"
          className="!w-12 !h-12 flex-shrink-0"
        />
      ) : (
        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`text-sm truncate ${unread > 0 ? "font-bold text-foreground" : "font-medium text-foreground"}`}
          >
            {profile?.displayName ?? "…"}
          </p>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {timeAgo}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p
            className={`text-sm truncate flex-1 line-clamp-1 ${unread > 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}
          >
            {conversation.lastMessage.text}
          </p>
          {unread > 0 && (
            <Badge
              variant="destructive"
              className="h-5 min-w-5 px-1.5 text-[11px] leading-none flex-shrink-0 rounded-full"
            >
              {unread > 99 ? "99+" : unread}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Contact Item (for New Chat modal) ───────────────────────────────────────

function ContactItem({
  profile,
  onSelect,
}: {
  profile: Profile;
  onSelect: (username: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors">
      <AvatarImage
        blob={profile.avatarBlob}
        displayName={profile.displayName}
        username={profile.username}
        size="md"
        className="!w-10 !h-10 flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate leading-tight">
          {profile.displayName}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          @{profile.username}
        </p>
      </div>
      <Button
        data-ocid={`chat.new_chat_message_button.${profile.username}`}
        size="sm"
        variant="outline"
        className="flex-shrink-0 gap-1.5"
        onClick={() => onSelect(profile.username)}
      >
        <MessageCircle className="h-3.5 w-3.5" />
        Message
      </Button>
    </div>
  );
}

// ─── New Chat Modal ───────────────────────────────────────────────────────────

function NewChatModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const { principal } = useAuth();

  const { data: contacts, isLoading } = useQuery<Profile[]>({
    queryKey: ["messageable-contacts", principal],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const { Principal: P } = await import("@icp-sdk/core/principal");
      const myPrincipal = P.fromText(principal);
      const [followingPage, followerPage] = await Promise.all([
        actor.getFollowingProfiles(myPrincipal, 0n, 100n),
        actor.getFollowerProfiles(myPrincipal, 0n, 100n),
      ]);
      // Deduplicate by principal string
      const seen = new Map<string, Profile>();
      for (const p of [...followingPage.items, ...followerPage.items]) {
        seen.set(p.principal.toString(), p);
      }
      return Array.from(seen.values());
    },
    enabled: open && !!actor && !isFetching && !!principal,
    staleTime: 30_000,
  });

  const handleSelect = (username: string) => {
    onClose();
    navigate({ to: `/chat/${username}` });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="chat.new_chat_dialog"
        className="max-w-md p-0 overflow-hidden"
      >
        <DialogHeader className="px-4 pt-5 pb-3 border-b border-border">
          <DialogTitle className="font-display text-base font-semibold">
            New Message
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="divide-y divide-border">
              {[1, 2, 3, 4].map((k) => (
                <div key={k} className="flex items-center gap-3 px-4 py-3">
                  <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : !contacts || contacts.length === 0 ? (
            <div
              data-ocid="chat.new_chat_empty_state"
              className="py-12 px-4 text-center"
            >
              <p className="text-sm text-muted-foreground">
                No connections yet. Follow someone to start chatting.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {contacts.map((profile) => (
                <ContactItem
                  key={profile.principal.toString()}
                  profile={profile}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Empty State (show contacts to start with) ───────────────────────────────

function EmptyStateWithContacts() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const { principal } = useAuth();

  const { data: contacts, isLoading } = useQuery<Profile[]>({
    queryKey: ["messageable-contacts", principal],
    queryFn: async () => {
      if (!actor || !principal) return [];
      const { Principal: P } = await import("@icp-sdk/core/principal");
      const myPrincipal = P.fromText(principal);
      const [followingPage, followerPage] = await Promise.all([
        actor.getFollowingProfiles(myPrincipal, 0n, 100n),
        actor.getFollowerProfiles(myPrincipal, 0n, 100n),
      ]);
      const seen = new Map<string, Profile>();
      for (const p of [...followingPage.items, ...followerPage.items]) {
        seen.set(p.principal.toString(), p);
      }
      return Array.from(seen.values());
    },
    enabled: !!actor && !isFetching && !!principal,
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div data-ocid="chat.loading_state" className="divide-y divide-border">
        {[1, 2, 3, 4].map((k) => (
          <ConversationSkeleton key={k} />
        ))}
      </div>
    );
  }

  if (!contacts || contacts.length === 0) {
    return (
      <div
        data-ocid="chat.empty_state"
        className="flex flex-col items-center py-20 px-4 text-center"
      >
        <MessageSquarePlus className="h-14 w-14 text-muted-foreground/40 mb-4" />
        <p className="font-semibold text-foreground mb-1">No messages yet</p>
        <p className="text-sm text-muted-foreground">
          Follow someone and they'll appear here when you're ready to chat.
        </p>
      </div>
    );
  }

  return (
    <div data-ocid="chat.empty_state" className="px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-0">
        Start a conversation
      </p>
      <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
        {contacts.map((profile) => (
          <div
            key={profile.principal.toString()}
            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
          >
            <AvatarImage
              blob={profile.avatarBlob}
              displayName={profile.displayName}
              username={profile.username}
              size="md"
              className="!w-10 !h-10 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate leading-tight">
                {profile.displayName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                @{profile.username}
              </p>
            </div>
            <Button
              data-ocid={`chat.start_chat_button.${profile.username}`}
              size="sm"
              variant="outline"
              className="flex-shrink-0 gap-1.5"
              onClick={() => navigate({ to: `/chat/${profile.username}` })}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Message
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { isAuthenticated, isInitializing } = useAuth();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const [newChatOpen, setNewChatOpen] = useState(false);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) navigate({ to: "/" });
  }, [isAuthenticated, isInitializing, navigate]);

  const { data: conversations, isLoading } = useQuery<ConversationPreview[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listConversations();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    refetchInterval: 3_000,
    staleTime: 2_000,
  });

  if (!isAuthenticated && !isInitializing) return null;

  const hasConversations = conversations && conversations.length > 0;

  return (
    <div data-ocid="chat.page" className="max-w-2xl mx-auto pb-24 md:pb-6">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h1 className="font-display text-xl font-bold text-foreground">
              Messages
            </h1>
          </div>
          <Button
            data-ocid="chat.new_chat_button"
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => setNewChatOpen(true)}
          >
            <PenSquare className="h-4 w-4" />
            New Chat
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Direct messages with your connections
        </p>
      </div>

      {/* Conversations list */}
      {isLoading ? (
        <div data-ocid="chat.loading_state" className="divide-y divide-border">
          {[1, 2, 3, 4].map((k) => (
            <ConversationSkeleton key={k} />
          ))}
        </div>
      ) : hasConversations ? (
        <div
          data-ocid="chat.conversations_list"
          className="divide-y divide-border"
        >
          {conversations.map((conv, i) => (
            <ConversationItem
              key={conv.partner.toString()}
              conversation={conv}
              index={i}
            />
          ))}
        </div>
      ) : (
        <EmptyStateWithContacts />
      )}

      <NewChatModal open={newChatOpen} onClose={() => setNewChatOpen(false)} />
    </div>
  );
}
