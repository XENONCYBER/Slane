"use client";

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { Header } from "./header";
import { ChatInput } from "./chat-input";

const ChannelIdPage = () => {
    const channelId = useChannelId();

    const { data: channel, isLoading: channelLoading } = useGetChannel({ id: channelId });

    if(channelLoading) {
        return(
            <div className="h-full flex items-center justify-center">
                <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if(!channel) {
        return(
            <div className="h-full flex flex-1 flex-col gap-y-2 items-center justify-center">
                <AlertTriangle className="size-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Channel not found</span>    
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
        <Header title={channel.name} />
        <div className="flex-1" />
        <ChatInput placeholder={`Message # ${channel.name}`}/>
        </div>
    );
};

export default ChannelIdPage;