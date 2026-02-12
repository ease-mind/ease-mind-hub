import { Box } from "@mui/material";
import { EaseMindButton, EaseMindModal, EaseMindText } from "@repo/ui";

export interface DeleteCardModalProps {
  open: boolean;
  onClose: () => void;
  cardId: string | null;
  onConfirm: (cardId: string) => void;
}

export const DeleteCardModal = ({
  open,
  onClose,
  onConfirm,
  cardId,
}: DeleteCardModalProps) => {
  return (
    <EaseMindModal
      open={open}
      onClose={onClose}
      title="Confirmar exclusão"
      illustration="error"
      illustrationSize="md"
      illustrationShow={false}
    >
      <Box>
        <EaseMindText style={{ marginBottom: 16 }}>
          Tem certeza que deseja excluir este cartão?
        </EaseMindText>
        <Box style={{ display: "flex", gap: 8 }}>
          <EaseMindButton
            label="Sim"
            color="error"
            variant="contained"
            onClick={() => {
              if (cardId) onConfirm(cardId);
            }}
          />
          <EaseMindButton
            label="Não"
            color="secondary"
            variant="outlined"
            onClick={onClose}
          />
        </Box>
      </Box>
    </EaseMindModal>
  );
};
