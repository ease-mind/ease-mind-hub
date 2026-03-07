import { EasemindDrawerProps } from "../../classes/models/drawer";
import { Box, Drawer } from "@mui/material";
import { EasemindText } from "../text/text";
import { EasemindDivider } from "../divider/divider";
import CloseIcon from '@mui/icons-material/Close';

export function EasemindDrawer({title, children, anchor, open, onClose}: EasemindDrawerProps) {
    return (
        <Drawer anchor={anchor} open={open} onClose={onClose} color="#fff" >
            <Box minWidth={'25em'}>
                <Box px={4} py={3}>
                    <EasemindText variant={'md'} sx={{ paddingTop: 2, paddingBottom: 2, fontWeight: 600 }}>
                        {title}
                    </EasemindText>
                    
                    <CloseIcon sx={{ cursor: 'pointer', position: 'absolute', right: 16, top: 30 }} onClick={() => onClose?.({}, 'escapeKeyDown')} />
                </Box>
                <EasemindDivider type="horizontal" />
                <Box px={4} py={2}>
                    {children}
                </Box>
            </Box>
        </Drawer>
    );
}