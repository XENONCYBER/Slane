import { Button } from "@/components/ui/button";
import { FaChevronDown } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogTrigger
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirmed";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

interface HeaderProps {
    title: string;
};

export const Header = ({ title }: HeaderProps) => {
    const router = useRouter();
    const channelId = useChannelId();
    const workspaceId = useWorkspaceId();

    const [editOpen, setEditOpen] = useState(false);
    const [value, setValue] = useState(title);
    const [ConfirmDialog, confirm] = useConfirm("Delete this Channel","Are you sure you want to delete this channel?");

    const { mutate: updateChannel, isPending: updatingChannel } = useUpdateChannel();
    const { mutate: removeChannel, isPending: removingChannel } = useUpdateChannel();

    const handleDelete = async() => {
        const ok = await confirm();
        if (!ok) return;
        removeChannel({
            id: channelId,
            name: value
        }, {
            onSuccess() {
                toast.success("Channel deleted successfully");
                router.push(`/workspace/${workspaceId}`);
            },
            onError: () => {
                toast.error("Failed to delete channel");
    }
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
        setValue(value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateChannel({ name: value, id: channelId }, {
            onSuccess(id) {
                toast.success("Channel updated successfully");
                setEditOpen(false);
            },
            onError: () => {
                toast.error("Failed to update channel");
            },
        });
    }  

    return (
        <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
            <ConfirmDialog />
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" className="text-lg font-semibold px-2 overflow-hidden w-auto" size="sm">
                        <span className="truncate">
                            # {title}
                        </span>
                        <FaChevronDown className="size-2.5 ml-2" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-50 overflow-hidden p-0">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle>
                            # {title}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">
                                            Channel Name
                                        </p>
                                        <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>
                                    </div>
                                    <p className="text-sm"># {title}</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-50 p-4">
                                <DialogHeader>
                                    <DialogTitle>
                                        Rename Channel
                                    </DialogTitle>
                                </DialogHeader>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <Input value={value} onChange={handleChange} disabled={updatingChannel} autoFocus
                                    minLength={3} maxLength={80} placeholder="Channel Name"
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" disabled={updatingChannel}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button disabled={updatingChannel}>
                                            Save
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <button onClick={handleDelete} disabled={removingChannel}
                            className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600">
                            <TrashIcon className="size-4 text-red-500" />
                            <p className="text-sm font-semibold">Delete Channel</p>
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
};