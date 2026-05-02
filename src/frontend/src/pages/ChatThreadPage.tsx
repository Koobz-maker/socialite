import { createActor } from "@/backend";
import type { DirectMessageView, Profile } from "@/backend";
import { AvatarImage } from "@/components/AvatarImage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { format, isToday, isYesterday } from "date-fns";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMessageTime(ts: bigint): string {
  const date = new Date(Number(ts / 1_000_000n));
  if (isToday(date)) return format(date, "h:mm a");
  if (isYesterday(date)) return `Yesterday ${format(date, "h:mm a")}`;
  return format(date, "MMM d, h:mm a");
}

// ─── Message Bubble Group ─────────────────────────────────────────────────────

interface MessageGroup {
  isMine: boolean;
  messages: DirectMessageView[];
}

function groupMessages(
  messages: DirectMessageView[],
  myPrincipal: string,
): MessageGroup[] {
  const groups: MessageGroup[] = [];
  for (const msg of messages) {
    const isMine = msg.from.toString() === myPrincipal;
    const last = groups[groups.length - 1];
    if (last && last.isMine === isMine) {
      last.messages.push(msg);
    } else {
      groups.push({ isMine, messages: [msg] });
    }
  }
  return groups;
}

// ─── Thread Header Skeleton ───────────────────────────────────────────────────

function ThreadHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0">
      <Skeleton className="w-9 h-9 rounded-full" />
      <div className="flex items-center gap-3 flex-1">
        <Skeleton className="w-9 h-9 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

// ─── Messages Skeleton ────────────────────────────────────────────────────────

function MessagesSkeleton() {
  return (
    <div data-ocid="chat_thread.loading_state" className="space-y-4 px-4 py-4">
      {([false, true, false, true, true] as boolean[]).map((isMine, i) => (
        <div
          key={`skel-${i}-${isMine ? "mine" : "theirs"}`}
          className={`flex ${isMine ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`flex flex-col ${isMine ? "items-end" : "items-start"} gap-1`}
          >
            <Skeleton
              className={`h-10 rounded-2xl ${isMine ? "w-48" : "w-56"}`}
            />
            <Skeleton className="h-2.5 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChatThreadPage() {
  const { partnerUsername } = useParams({ from: "/chat/$partnerUsername" });
  const { isAuthenticated, isInitializing, principal } = useAuth();
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [savedText, setSavedText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prevMessageCountRef = useRef(0);

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) navigate({ to: "/" });
  }, [isAuthenticated, isInitializing, navigate]);

  // Resolve partner profile by searching for the username
  const { data: partnerProfile, isLoading: profileLoading } =
    useQuery<Profile | null>({
      queryKey: ["profileByUsername", partnerUsername],
      queryFn: async () => {
        if (!actor) return null;
        const result = await actor.searchUsers(partnerUsername, 0n, 10n);
        const match = result.items.find((p) => p.username === partnerUsername);
        return match ?? null;
      },
      enabled: !!actor && !isFetching,
      staleTime: 60_000,
    });

  // Fetch conversation messages
  const { data: messages, isLoading: messagesLoading } = useQuery<
    DirectMessageView[]
  >({
    queryKey: ["conversation", partnerProfile?.principal?.toString()],
    queryFn: async () => {
      if (!actor || !partnerProfile) return [];
      const msgs = await actor.getConversation(
        partnerProfile.principal,
        100n,
        0n,
      );
      // Mark as read after fetching
      actor.markConversationRead(partnerProfile.principal).catch(() => {});
      return msgs;
    },
    enabled: !!actor && !isFetching && !!partnerProfile,
    refetchInterval: 2_000,
    staleTime: 1_000,
  });

  // Invalidate unread counts whenever in this thread
  useEffect(() => {
    if (partnerProfile) {
      queryClient.invalidateQueries({ queryKey: ["unreadMessageCount"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  }, [partnerProfile, queryClient]);

  // Scroll to bottom on initial load and when new messages arrive
  const messagesLen = messages?.length ?? 0;
  useEffect(() => {
    if (messagesLen > 0 && messagesLen !== prevMessageCountRef.current) {
      const isInitial = prevMessageCountRef.current === 0;
      prevMessageCountRef.current = messagesLen;
      bottomRef.current?.scrollIntoView({
        behavior: isInitial ? "auto" : "smooth",
      });
    }
  }, [messagesLen]);

  // Initial scroll on load
  useEffect(() => {
    if (!messagesLoading && messagesLen > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messagesLoading, messagesLen]);

  const sendMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!actor || !partnerProfile) throw new Error("No actor or partner");
      const ok = await actor.sendMessage(partnerProfile.principal, messageText);
      if (!ok) throw new Error("NOT_ALLOWED");
      return ok;
    },
    onSuccess: () => {
      setText("");
      setSavedText("");
      queryClient.invalidateQueries({
        queryKey: ["conversation", partnerProfile?.principal?.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      inputRef.current?.focus();
    },
    onError: (err: Error) => {
      // Restore the text the user had typed
      setText(savedText);
      if (err.message === "NOT_ALLOWED") {
        toast.error(
          "You can only message people who follow you or who you follow.",
        );
      } else {
        toast.error("Message failed to send. Try again.");
      }
    },
  });

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || sendMutation.isPending) return;
    setSavedText(trimmed);
    setText("");
    sendMutation.mutate(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isAuthenticated && !isInitializing) return null;

  const messageGroups =
    messages && principal ? groupMessages(messages, principal) : [];

  return (
    <div
      data-ocid="chat_thread.page"
      className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-3.5rem)]"
    >
      {/* Thread Header */}
      {profileLoading ? (
        <ThreadHeaderSkeleton />
      ) : (
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            data-ocid="chat_thread.back_button"
            onClick={() => navigate({ to: "/chat" })}
            aria-label="Back to messages"
            className="flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {partnerProfile ? (
            <button
              type="button"
              className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
              onClick={() =>
                navigate({ to: `/profile/${partnerProfile.username}` })
              }
            >
              <AvatarImage
                blob={partnerProfile.avatarBlob}
                displayName={partnerProfile.displayName}
                username={partnerProfile.username}
                size="sm"
                className="!w-9 !h-9 flex-shrink-0"
              />
              <div className="min-w-0 text-left">
                <p className="text-sm font-semibold text-foreground truncate leading-tight">
                  {partnerProfile.displayName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  @{partnerProfile.username}
                </p>
              </div>
            </button>
          ) : (
            <p className="text-sm text-muted-foreground flex-1">
              @{partnerUsername}
            </p>
          )}
        </div>
      )}

      {/* Messages Area */}
      <div
        data-ocid="chat_thread.messages_list"
        className="flex-1 overflow-y-auto px-4 py-4"
      >
        {messagesLoading || profileLoading ? (
          <MessagesSkeleton />
        ) : !messages || messages.length === 0 ? (
          <div
            data-ocid="chat_thread.empty_state"
            className="flex flex-col items-center py-12 text-center"
          >
            <p className="text-sm text-muted-foreground">
              No messages yet. Say hi to{" "}
              <span className="font-medium text-foreground">
                {partnerProfile?.displayName ?? partnerUsername}
              </span>
              !
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messageGroups.map((group) => (
              <div
                key={group.messages[0].id.toString()}
                className={`flex flex-col gap-0.5 ${group.isMine ? "items-end" : "items-start"}`}
              >
                {group.messages.map((msg, mi) => {
                  const isLast = mi === group.messages.length - 1;
                  return (
                    <div
                      key={msg.id.toString()}
                      data-ocid={`chat_thread.message.${msg.id.toString()}`}
                      className={`flex flex-col ${group.isMine ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${
                          group.isMine
                            ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                            : "bg-muted text-foreground rounded-2xl rounded-bl-sm"
                        } ${!isLast ? "mb-0.5" : ""}`}
                      >
                        {msg.text}
                      </div>
                      {isLast && (
                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                          {formatMessageTime(msg.createdAt)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-end gap-2 px-4 py-3 border-t border-border bg-card flex-shrink-0">
        <textarea
          ref={inputRef}
          data-ocid="chat_thread.message_input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${partnerProfile?.displayName ?? partnerUsername}…`}
          className="flex-1 min-h-[40px] max-h-[120px] resize-none rounded-xl px-3 py-2.5 text-sm bg-muted border border-transparent focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed placeholder:text-muted-foreground disabled:opacity-50"
          disabled={sendMutation.isPending}
          maxLength={1000}
          autoComplete="off"
          rows={1}
          style={{ height: "auto" }}
          onInput={(e) => {
            const target = e.currentTarget;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
          }}
        />
        <Button
          data-ocid="chat_thread.send_button"
          size="icon"
          disabled={!text.trim() || sendMutation.isPending}
          onClick={handleSend}
          aria-label="Send message"
          className="h-10 w-10 flex-shrink-0 rounded-xl"
        >
          {sendMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
