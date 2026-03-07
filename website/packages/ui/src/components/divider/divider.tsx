import { Box } from '@mui/material';
import './style.scss';
import { useTheme } from '@repo/utils';

export interface DividerProps {
    type?: 'horizontal' | 'vertical';
    className?: string;
    color?: string;
}

export function EasemindDivider({
    type = 'horizontal',
    color,
    className
}: DividerProps) {
    const { colors } = useTheme();
    color = color ?? colors['grey.400'];

    return (
        <Box className={`divider divider--${type} ${className}`} sx={{ backgroundColor: color }}></Box>
    );
}