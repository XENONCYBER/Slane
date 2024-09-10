import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadURL } from "@/features/upload/api/use-generate-uploadURL";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

interface ChatInputProps {
    placeholder: string;
};

type CreateMessageValues = {
    channelId: Id<"channels">;
    workspaceId: Id<"workspaces">;
    body: string;
    image?: Id<"_storage"> | undefined;
    doc?: Id<"_storage"> | undefined;
};

export const ChatInput = ({ placeholder }: ChatInputProps) => {
    const [editorKey, setEditorKey] = useState(0);
    const [isPending, setIsPending] = useState(false);

    const editorRef = useRef<Quill | null>(null);

    const workspaceId = useWorkspaceId();
    const channelId = useChannelId();

    const { mutate: generateUploadURL } = useGenerateUploadURL();

    const { mutate: createMessage } = useCreateMessage();

    const handleSubmit = async ({
        body,
        image,
        doc,
    }: {
        body: string;
        image: File | null;
        doc: File | null;
    }) => {
        try {
            setIsPending(true);
            editorRef.current?.enable(false);

            const values: CreateMessageValues = {
                body,
                workspaceId,
                channelId,
                image: undefined,
                doc: undefined,
            };

            if (image) {
                const url = await generateUploadURL({}, { throwError: true });

                if (!url) {
                    throw new Error("Failed to generate upload URL");
                }

                const result = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": image?.type || "application/octet-stream" },
                    body: image,
                });

                if(!result.ok) {
                    throw new Error("Failed to upload image"); 
                };
                const { storageId } = await result.json();

                values.image = storageId;
            }
            if (doc) {
                const url = await generateUploadURL({}, { throwError: true });

                if (!url) {
                    throw new Error("Failed to generate upload URL");
                }

                const result = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": doc?.type || "application/octet-stream" },
                    body: doc,
                });

                if(!result.ok) {
                    throw new Error("Failed to upload image"); 
                };
                const { docStorageId } = await result.json();

                values.image = docStorageId;
            }


            await createMessage(values, { throwError: true });

            setEditorKey((prevKey) => prevKey + 1);
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setIsPending(false);
            editorRef.current?.enable(true);
        }
    };


    return (
        <div className="px-5 w-full">
            <Editor
                key={editorKey}
                placeholder={placeholder}
                onSubmit={handleSubmit}
                disabled={isPending}
                innerRef={editorRef}
            />
        </div>
    )
};