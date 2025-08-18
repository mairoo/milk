import React, {ReactNode} from "react";
import {Alert as ShadcnAlert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {cn} from "@/lib/utils";

interface AlertProps {
    children: ReactNode;
    title?: string;
    className?: string;
    variant?: 'warning' | 'info' | 'success' | 'error' | 'default';
}

export function Alert({
                          children,
                          title,
                          className,
                          variant = 'warning'
                      }: AlertProps) {

    const variantConfig = {
        warning: {
            className: "border-yellow-200 bg-yellow-50 text-yellow-950",
        },
        info: {
            className: "border-blue-200 bg-blue-50 text-blue-950",
        },
        success: {
            className: "border-green-200 bg-green-50 text-green-950",
        },
        error: {
            className: "border-red-200 bg-red-50 text-red-950",
        },
        default: {
            className: "",
        }
    };

    const config = variantConfig[variant];

    return (
        <ShadcnAlert className={cn(config.className, className)}>
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertDescription>
                {children}
            </AlertDescription>
        </ShadcnAlert>
    );
}