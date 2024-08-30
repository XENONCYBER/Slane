import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useNewJoinCode } from '@/features/workspaces/api/use-new-joincode';
import { useConfirm } from '@/hooks/use-confirmed';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { CopyIcon, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    joinCode: string;
};

export const InviteModal = ({ open, setOpen, name, joinCode }: InviteModalProps) => {
    const workspaceId = useWorkspaceId();
    const [ConfirmDialog, confirm] = useConfirm("Are you sure", "Current code will be deactivated and a new code will be generated. Do you want to continue?");

    const { mutate, isPending } = useNewJoinCode();

    const handleNewCode = async() => {
        const ok = await confirm();
        if (!ok) return;
        mutate({workspaceId}, {
            onSuccess: () => {
                toast.success('New join code generated');
            },
            onError: () => {
                toast.error('Failed to generate new join code');
            },
        });
    };

    const handleCopyJC = (joinCode: string) => {
        navigator.clipboard.writeText(joinCode)
            .then(() => toast.success('Join code copied to clipboard'));
    };

    const handleCopy = () => {
        const inviteLink = `${window.location.origin}/join/${workspaceId}`;

        navigator.clipboard.writeText(inviteLink)
            .then(() => toast.success('Invite link copied to clipboard'));
    };

    return (
        <>
        <ConfirmDialog />
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite People to {name}</DialogTitle>
                    <DialogDescription>
                        Share this code with others to invite them to this workspace.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-y-4 justify-center items-center py-10">
                    <div className='flex justify-center items-center'>
                        <p className='text-4xl font-bold tracking-widest uppercase'>
                            {joinCode}
                        </p>
                        <Button variant="ghost" size="sm" onClick={() => handleCopyJC(joinCode)}>
                            <CopyIcon className='size-6 m-2 ' />
                        </Button>
                    </div>
                    <Separator />
                    <Button variant="ghost" size="sm" onClick={handleCopy}>
                        Copy Link
                        <CopyIcon className='size-4 ml-2' />
                    </Button>
                </div>
                <div className="flex items-center justify-between w-full">
                    <Button variant="outline" onClick={handleNewCode} disabled={isPending}>
                        New Code
                        <RefreshCcw className='size-4 ml-2' />
                    </Button>
                    <DialogClose asChild>
                        <Button>Close</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
        </>
    );
};

export default InviteModal;