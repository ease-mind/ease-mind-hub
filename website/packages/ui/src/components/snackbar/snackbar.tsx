import { Alert, Snackbar } from '@mui/material';
import { EasemindSnackbarProps } from '../../classes/models/snackbar';
import { ReactElement } from 'react';

export function EasemindSnackbar({
  open,
  onClose,
  data,
}: EasemindSnackbarProps): ReactElement {
  return data ? (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={onClose} severity={data.status}>
          {data.message}
        </Alert>
      </Snackbar>
    </>
  ) : (
    <></>
  );
}
