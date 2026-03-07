import { AlertColor } from "@mui/material";

export interface EasemindSnackbarProps {
    open: boolean; 
    onClose: () => void;
    data: SnackbarData | null;
}

export interface SnackbarData {
    status: AlertColor; 
    message?: string;
}