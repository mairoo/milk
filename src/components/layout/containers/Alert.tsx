import React, {ReactNode} from "react";
import {Alert as ShadcnAlert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle, AlertTriangle, CheckCircle, Info} from "lucide-react";
import {cn} from "@/lib/utils";

interface AlertProps {
    children: ReactNode;
    title?: string;
    className?: string;
    variant?: 'warning' | 'info' | 'success' | 'error' | 'default';
    showIcon?: boolean;
}

export function Alert({
                          children,
                          title,
                          className,
                          variant = 'warning',
                          showIcon = true
                      }: AlertProps) {

    const variantConfig = {
        warning: {
            className: "border-yellow-200 bg-yellow-50 text-yellow-950",
            icon: AlertTriangle,
        },
        info: {
            className: "border-blue-200 bg-blue-50 text-blue-950",
            icon: Info,
        },
        success: {
            className: "border-green-200 bg-green-50 text-green-950",
            icon: CheckCircle,
        },
        error: {
            className: "border-red-200 bg-red-50 text-red-950",
            icon: AlertCircle,
        },
        default: {
            className: "",
            icon: Info,
        }
    };

    const config = variantConfig[variant];
    const IconComponent = config.icon;

    return (
        <ShadcnAlert className={cn(config.className, className)}>
            {showIcon && <IconComponent className="h-4 w-4"/>}
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertDescription>
                {children}
            </AlertDescription>
        </ShadcnAlert>
    );
}