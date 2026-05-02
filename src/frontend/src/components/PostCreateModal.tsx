import { createActor } from "@/backend";
import { ExternalBlob } from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface PostCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostCreateModal({ open, onOpenChange }: PostCreateModalProps) {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      let photoBlob: ExternalBlob | undefined;
      if (fileRef.current) {
        const bytes = new Uint8Array(await fileRef.current.arrayBuffer());
        photoBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
          setUploadProgress(pct),
        );
      }
      return actor.createPost({ caption, photoBlob });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["explore"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      toast.success("Post published!");
      handleClose();
    },
    onError: () => {
      toast.error("Failed to publish post. Please try again.");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    fileRef.current = file;
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClose = () => {
    setCaption("");
    setPreviewUrl(null);
    setUploadProgress(0);
    fileRef.current = null;
    onOpenChange(false);
  };

  const canSubmit = caption.trim().length > 0 || fileRef.current !== null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        data-ocid="post_create.dialog"
        className="sm:max-w-md bg-card"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            Create Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            data-ocid="post_create.caption_input"
            placeholder="What's on your mind?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            className="resize-none bg-background border-input text-foreground placeholder:text-muted-foreground"
            maxLength={500}
          />

          {previewUrl ? (
            <div className="relative rounded-lg overflow-hidden aspect-[4/3] bg-muted">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <Button
                data-ocid="post_create.remove_image_button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-card/80 hover:bg-card"
                onClick={() => {
                  setPreviewUrl(null);
                  fileRef.current = null;
                }}
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              data-ocid="post_create.upload_button"
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-smooth cursor-pointer"
            >
              <ImagePlus className="h-6 w-6" />
              <span className="text-sm font-medium">Add photo</span>
            </button>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {createMutation.isPending && uploadProgress > 0 && (
            <div
              data-ocid="post_create.loading_state"
              className="w-full bg-muted rounded-full h-1.5"
            >
              <div
                className="bg-primary h-1.5 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-2">
          <Button
            data-ocid="post_create.cancel_button"
            variant="outline"
            className="flex-1"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            data-ocid="post_create.submit_button"
            className="flex-1 btn-primary"
            disabled={!canSubmit || createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            {createMutation.isPending ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
