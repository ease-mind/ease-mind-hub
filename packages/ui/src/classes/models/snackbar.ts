import { AlertColor } from "@mui/material";

export interface EaseMindSnackbarProps {
    open: boolean; 
    onClose: () => void;
    data: SnackbarData | null;
}

export interface SnackbarData {
    status: AlertColor; 
    message?: string;
}