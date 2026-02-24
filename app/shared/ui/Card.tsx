import { ColorsPalette } from "@/shared/classes/constants/Pallete";
import { JSX } from "react";
import { Card } from "react-native-paper";

export interface EasemindCardProps {
    bgcolor?: string;
    radius?: 'sm' | 'md' | 'lg';
    mode?: "elevated" | "outlined" | 'contained' | undefined;
    className?: string;
    children?: React.ReactNode;
    styles?: React.Attributes;
}

export enum EasemindCardRadius {
    sm = '5px',
    md = '10px',
    lg = '14px',
}

export function EasemindCard({
    bgcolor,
    radius = 'md',
    mode = 'outlined',
    children,
    className,
    styles
}: EasemindCardProps): JSX.Element {
    const palette = ColorsPalette.light;
    const cardColor = bgcolor ?? palette["background.card"];

    return (
        <Card
            mode={mode}
            style={{ backgroundColor: cardColor, borderRadius: EasemindCardRadius[radius], ...styles }}
            className={`${className}`}
        >
            {children}
        </Card>
    );
}