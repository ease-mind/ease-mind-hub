import { JSX } from 'react';
import { styled } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import { useTheme } from '@repo/utils';

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    tertiary: true;
    black: true;
    white: true;
  }
}

export interface EaseMindButtonProps extends ButtonProps {
  /**
   * O texto do botão
   */
  label: string;
  /**
   * A cor do botão
   */
  color:
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'error'
  | 'info'
  | 'warning'
  | 'black'
  | 'white';
  /**
   * O estilo do botão
   */

    /** Raio da borda (padrão: 5rem) */
  borderRadius?: string;

  variant?: 'contained' | 'text' | 'outlined';
  onClick?: () => void;
}

export function EaseMindButton({
  label,
  color,
  variant,
  borderRadius,
  onClick,
  ...props
}: EaseMindButtonProps): JSX.Element {
  const { colors } = useTheme();
  const palette = colors;

  const ButtonColor = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'borderRadius'
})<ButtonProps & { borderRadius?: string }>(({ borderRadius }) => ([{
    '&.MuiButton-containedSecondary': {
      backgroundColor: palette['lime.500'],
      color: palette['lime.subcontrast']
    },
    '&.MuiButton-outlinedSecondary': {
      borderColor: palette['lime.800'],
      color: palette['lime.800'],
    },
    '&.MuiButton-textSecondary': {
      color: palette['lime.800'],
    },
    '&.MuiButton-textTertiary': {
      color: palette['lime.highcontrast'],
    },
    '&.MuiButton-outlinedTertiary': {
      borderColor: palette['lime.400'],
      color: palette['lime.highcontrast'],
    },
    '&.MuiButton-containedTertiary': {
      border: '1px solid',
      borderColor: 'rgb(199 201 145 / 15%)',
      backgroundColor: palette['lime.100'],
    },
    '&.MuiButton-containedPrimary': {
      backgroundColor: palette['lime.900'],
      color: palette['lime.50'],
    },
    '&.MuiButton-outlinedPrimary': {
      borderColor: palette['lime.700'],
      color: palette['lime.900'],
    },
    '&.MuiButton-textPrimary': {
      color: palette['lime.900'],
    },
    '&.Mui-disabled': {
      color: '#3E3E3E',
      backgroundColor: '#A7A7A7',
    },
    '&': {
      borderWidth: '1px',
      borderRadius: borderRadius || '5rem',
      padding: '.6rem 1.2rem !important',
      boxShadow: 'none !important',
      textTransform: 'none !important',
      fontSize: '15px !important',
      fontWeight: 400,
    },
    '&.MuiButton-contained:hover,&.MuiButton-outlined:hover': {
      boxShadow: '0px 1px 1px -2px rgba(0,0,0,0.1),0px 1px 1px 0px rgba(0,0,0,0.1),1px 1px 4px 0px rgba(0,0,0,0.1)',
    },
    '&.MuiButton-outlined:hover,&.MuiButton-text:hover': {
      backgroundColor: 'rgba(211, 217, 184, 0.2)',
    }
  }
  ]));

  return (
    <ButtonColor
      {...props}
      type="submit"
      variant={variant}
      color={color}
      aria-label={label}
      onClick={onClick}
      borderRadius={borderRadius}
    >
      {label}
    </ButtonColor>
  );
}
