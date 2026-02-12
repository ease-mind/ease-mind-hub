import { JSX } from "react";
import { Card } from '@mui/material';
import { colorsPalette, useTheme } from "@repo/utils";

export interface EaseMindCardProps {
    bgcolor?: string;
    radius?: 'sm' | 'md' | 'lg';
    variant?: "elevation" | "outlined" | undefined;
    className?: string;
    children?: React.ReactNode;
    styles?: React.CSSProperties;
}

export enum EaseMindCardRadius {
    sm = '5px',
    md = '10px',
    lg = '14px',
}

export function EaseMindCard({
    bgcolor,
    radius = 'md',
    variant = 'outlined',
    children,
    className,
    styles
}: EaseMindCardProps): JSX.Element {
    const { isDarkMode } = useTheme();
    const palette = !isDarkMode ? colorsPalette.light : colorsPalette.dark;
    const cardColor = bgcolor ?? palette["background.card"];

    return (
        <Card
            variant={variant}
            sx={{ background: cardColor, borderRadius: EaseMindCardRadius[radius], ...styles }}
            className={`${className}`}
        >
            {children}
        </Card>
    );
}