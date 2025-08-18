import ReactMarkdown from 'react-markdown'
import {cn} from '@/lib/utils'

interface StyledMarkdownProps {
    children: string
    className?: string
    variant?: 'default' | 'compact' | 'large'
}

export function StyledMarkdown({
                                   children,
                                   className,
                                   variant = 'default'
                               }: StyledMarkdownProps) {
    const baseStyles = {
        default: "prose prose-sm max-w-none",
        compact: "prose prose-xs max-w-none",
        large: "prose prose-base max-w-none"
    }

    return (
        <div className={cn(
            baseStyles[variant],
            "w-full min-w-0 overflow-hidden",
            "prose-headings:font-bold prose-headings:text-gray-900",
            "prose-p:my-1 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:break-words",
            "prose-ul:my-1 prose-ul:pl-4.5",
            "prose-li:my-0 prose-li:text-gray-700 prose-li:break-words",
            "prose-strong:font-semibold prose-strong:text-gray-900",
            "prose-em:italic prose-em:text-gray-600",
            "prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 prose-a:break-all",
            "prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic",
            "prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:break-all",
            "prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto",
            className
        )}>
            <ReactMarkdown>
                {children}
            </ReactMarkdown>
        </div>
    )
}