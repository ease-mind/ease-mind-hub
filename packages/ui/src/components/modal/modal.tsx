import './style.scss';
import { Box, IconButton, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@repo/utils';
import { EaseMindModalProps } from '../../classes';
import { EaseMindText } from '../text/text';

export function EaseMindModal({
  onClose,
  open,
  children,
  title,
}: EaseMindModalProps) {
  const { isDarkMode, colors } = useTheme();
  const bgColor = isDarkMode ? colors['lime.50'] : colors['white.main'];
  return (
    <Modal open={open} onClose={onClose} aria-labelledby={title}>
      <Box
        className={`easemind-modal`}
        sx={{ backgroundColor: bgColor, borderColor: colors['lime.200'], borderWidth: 1, borderStyle: 'solid' }}
      >
        <Box
          className="easemind-modal-close"
        >
        <IconButton onClick={(event) => onClose?.(event, 'backdropClick')}>
          <CloseIcon />
        </IconButton>
        </Box>


        <Box pb={2}>
          <EaseMindText alignContent="center" fontWeight="700" color="textPrimary" variant={'md'} >
            {title}
          </EaseMindText>
        </Box>
        {children}
      </Box>
    </Modal>
  );
}
