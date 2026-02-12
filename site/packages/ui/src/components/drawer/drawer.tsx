import { EaseMindDrawerProps } from "../../classes/models/drawer";
import { Box, Drawer } from "@mui/material";
import { EaseMindText } from "../text/text";
import { EaseMindDivider } from "../divider/divider";
import CloseIcon from '@mui/icons-material/Close';

export function EaseMindDrawer({title, children, anchor, open, onClose}: EaseMindDrawerProps) {
    return (
        <Drawer anchor={anchor} open={open} onClose={onClose} color="#fff" >
            <Box minWidth={'25em'}>
                <Box px={4} py={3}>
                    <EaseMindText variant={'md'} sx={{ paddingTop: 2, paddingBottom: 2, fontWeight: 600 }}>
                        {title}
                    </EaseMindText>
                    
                    <CloseIcon sx={{ cursor: 'pointer', position: 'absolute', right: 16, top: 30 }} onClick={() => onClose?.({}, 'escapeKeyDown')} />
                </Box>
                <EaseMindDivider type="horizontal" />
                <Box px={4} py={2}>
                    {children}
                </Box>
            </Box>
        </Drawer>
    );
}