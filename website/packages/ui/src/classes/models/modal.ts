import { ModalProps } from "@mui/material";

export interface EaseMindModalProps extends ModalProps {
    title: string;
    illustrationShow?: boolean;
    fullHeight?: boolean;
    illustration?: string
    illustrationSize?: 'sm' | 'md' | 'lg';
  }
