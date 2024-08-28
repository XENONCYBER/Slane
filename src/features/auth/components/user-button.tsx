"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "../hooks/use-current-user";
import { Loader } from "lucide-react";

export const UserButton = () => {
    const {data, isLoading} = useCurrentUser();

    if (isLoading) {
        return <Loader className="size-4 animate-spin text-muted-foreground"/>;
    }

    if (!data) {
        return null;
    }

    const { image, name, email } = data;

    const AvatarFallback = name!.charAt(0).toUpperCase();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative">
                <Avatar className="size-10 hover:opacity-75 transition">
                    <AvatarImage />
                    <AvatarFallback>

                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="right" className="w-60">
                <DropdownMenuItem>
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};