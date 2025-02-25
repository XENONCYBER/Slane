"use client"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";

interface HintProps {
    label: any ;
    children: React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
};

export const Hint = ({ label, children, side , align }: HintProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side} align={align} className="bg-black text-white border borde-white/5">
                <p className="font-md text-xs">{label}</p>
            </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
};