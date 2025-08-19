import {cn} from "@/lib/utils"
import React, {ReactNode} from "react";

interface SectionProps {
    title?: string
    description?: string
    children: ReactNode
    className?: string;
}

export default function Section({
                                    title,
                                    description,
                                    children,
                                    className,
                                    ...props
                                }: SectionProps) {
    return (
        <section className={cn("space-y-2", className)} {...props}>
            {title && (
                <div>
                    <h2 className="text-xl font-semibold text-orange-400 tracking-tight">{title}</h2>
                    {description && (
                        <p className="text-muted-foreground">{description}</p>
                    )}
                </div>
            )}
            <div>{children}</div>
        </section>
    )
}
