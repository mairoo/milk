import Link from 'next/link'
import {LucideIcon} from 'lucide-react'
import React from "react";

interface NavLinkProps {
    href: string
    icon: LucideIcon
    children: React.ReactNode
    onClick?: () => void
}

export function NavLink({href, icon: Icon, children, onClick}: NavLinkProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm hover:bg-gray-100 hover:text-gray-900 hover:font-bold transition-colors"
        >
            <Icon className="h-4 w-4"/>
            {children}
        </Link>
    )
}