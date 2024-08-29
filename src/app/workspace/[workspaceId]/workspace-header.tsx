import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Doc } from '../../../../convex/_generated/dataModel';
import { ChevronDown } from 'lucide-react';

interface WorkspaceHeaderProps {
    workspace: Doc<"workspaces">;
};

export const WorkspaceHeader = ({ workspace} : WorkspaceHeaderProps) => {
    return (
        <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="transparent" className='font-semibold text-lg w-auto p-1.5 overflow-hidden'>
                        <span className='truncate'>{workspace.name}</span>
                        <ChevronDown className='size-4 ml-1 shrink-0' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side='bottom' align='start' className='w-64'>
                    <DropdownMenuItem className='cursor-pointer capitalize'>
                        <div className='size-9 relative overflow-hidden bg-[#606160] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2'>
                            {workspace.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col items-start">
                            <p className='font-bold'>{workspace.name}</p>
                            <p className='text-xs text-muted-foreground'>Active Workspace</p>
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className='cursor-pointer py-2' onClick={() => {}}>
                    Invite People to {workspace.name}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer py-2' onClick={() => {}}>
                    Preferences</DropdownMenuItem>
                </DropdownMenuContent>

            </DropdownMenu>
        </div>
    )
};

export default WorkspaceHeader;