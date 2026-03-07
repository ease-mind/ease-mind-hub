import { Box, Typography, TypographyProps } from '@mui/material';

export interface EasemindTextProps extends TypographyProps {
  children: React.ReactNode;
  color?: string;
  variant?: 'xs' | 'sm' | 'md' | 'lg' | 'h1' | 'h2' | 'h3' | 'h4' | 'xxl';
  fontSize?: string;
}

export function EasemindText({
  children,
  color,
  variant,
  fontSize,
  ...props
}: EasemindTextProps) {
  return (
    <Box>
      <Typography
        {...props}
        fontSize={fontSize}
        variant={variant}
        color={color}
      >
        {children}
      </Typography>
    </Box>
  );
}