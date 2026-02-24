import { Box, Typography, TypographyProps } from '@mui/material';

export interface EaseMindTextProps extends TypographyProps {
  children: React.ReactNode;
  color?: string;
  variant?: 'xs' | 'sm' | 'md' | 'lg' | 'h1' | 'h2' | 'h3' | 'h4' | 'xxl';
  fontSize?: string;
}

export function EaseMindText({
  children,
  color,
  variant,
  fontSize,
  ...props
}: EaseMindTextProps) {
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