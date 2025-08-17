import {ReactNode} from "react";

export interface RootLayoutProps {
    children: ReactNode
}

export interface MainContainerProps {
    children: ReactNode;
    className?: string;
}