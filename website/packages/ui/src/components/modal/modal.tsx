import './style.scss';
import { Box, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@repo/utils';
import { EasemindModalProps } from '../../classes';
import { EasemindText } from '../text/text';

export function EasemindModal({
  onClose,
  open,
  children,
  title,
}: EasemindModalProps) {
  const { isDarkMode, colors } = useTheme();
  const bgColor = isDarkMode ? colors['coral.50'] : colors['white.main'];
  return (
    <Modal open={open} onClose={onClose} aria-labelledby={title}>
      <Box
        className={`easemind-modal`}
        sx={{ backgroundColor: bgColor, borderColor: colors['coral.200'], borderWidth: 1, borderStyle: 'solid' }}
      >
        <Box
          className="easemind-modal-close"
        >
        <IconButton onClick={(event) => onClose?.(event, 'backdropClick')}>
          <CloseIcon />
        </IconButton>
        </Box>


        <Box pb={2}>
          <EasemindText alignContent="center" fontWeight="700" color="textPrimary" variant={'md'} >
            {title}
          </EasemindText>
        </Box>
        {children}
      </Box>
    </Modal>
  );
}
