import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {LucideIcon} from "lucide-react";
import React from "react";

interface NavButtonProps {
    icon: LucideIcon
    children: React.ReactNode
    onClick: () => void
    variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link"
    className?: string
}

export function NavButton({
                              icon: Icon,
                              children,
                              onClick,
                              variant = "ghost",
                              className
                          }: NavButtonProps) {
    return (
        <Button
            variant={variant}
            onClick={onClick}
            className={cn(
                "inline-flex items-center gap-2 h-auto px-3 py-2 hover:bg-gray-100 hover:text-gray-900 hover:font-bold cursor-pointer",
                className
            )}
        >
            <Icon className="h-4 w-4"/>
            {children}
        </Button>
    )
}