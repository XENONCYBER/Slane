"use client";

import { Button } from "@/components/ui/button";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspaceInfo";
import { useJoin } from "@/features/workspaces/api/use-join";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import VerificationInput from "react-verification-input";
import { toast } from "sonner";
import { useMemo } from "react";

const joinPage = () => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const {mutate, isPending} = useJoin();
    const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });

    const handleComplete = (value: string) => {
        mutate({ workspaceId, joinCode: value }, {
            onSuccess: (id) => {
                toast.success("Successfully joined the workspace");
                router.replace(`/workspaces/${id}`);
            },
            onError: (error) => {
                toast.error("Failed to join workspace");
            },
        });
    };

    if (isLoading){
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="size-6 animate-spin text-muted-foreground"/>
            </div>
        );
    }

    return (
        <div className="h-full gap-y-8 items-center justify-center bg-white shadow-md flex flex-col p-8 rounded-lg">
            <Image src="/logo.svg" width={60} height={60} alt="logo" />
            <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
                <div className="flex flex-col gap-y-2 items-center justify-center">
                    <h1 className="text-2xl font-bold">Join {data?.name}</h1>
                    <p className="text-md text-muted-foreground">Enter the workspace Code to join</p>
                </div>
                <VerificationInput classNames={{
                    container: cn("flex gap-x-2", isPending && "cursor-not-allowed opacity-0"),
                    character: "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
                    characterInactive: "bg-muted",
                    characterSelected: "text-black bg-white",
                    characterFilled: "bg-white text-black",
                }}
                autoFocus length={6} onComplete={handleComplete}/>
            </div>
            <div className="flex gap-x-4">
                <Button size="lg" variant="outline" asChild>
                    <Link href="/">
                        Back to home
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default joinPage;