import { ModalProps } from "@mui/material";

export interface EasemindModalProps extends ModalProps {
    title: string;
    illustrationShow?: boolean;
    fullHeight?: boolean;
    illustration?: string
    illustrationSize?: 'sm' | 'md' | 'lg';
  }
