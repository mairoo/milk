'use client'

import React from "react";
import {cn} from "@/lib/utils"
import {MainContainerProps} from "@/global/types/layout";

export default function MainContainer({children, className}: MainContainerProps) {
    return (
        <main className={cn("p-2 md:px-0", className)}>
            <div className="mx-auto container">
                {children}
            </div>
        </main>
    );
}