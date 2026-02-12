import { Box } from "@mui/material";
import { ReactElement, useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import {
  EaseMindAccessModalProps,
  EaseMindModal,
  EaseMindInputController,
  EaseMindSelect,
  EaseMindButton,
  EaseMindSnackbar,
  SnackbarData,
} from "@repo/ui";
import { useUser } from "@repo/data-access";
import { useCreateCardBank } from "@repo/data-access";

export interface NewCardData {
  userId: string;
  name: string;
  functions: string[];
  variant: string;
}

const variantOptions = [
  { label: "Platinum", value: "platinum" },
  { label: "Gold", value: "gold" },
  { label: "Black", value: "black" },
];

const functionOptions = [
  { label: "Crédito", value: "credit" },
  { label: "Débito", value: "debit" },
];

export function EaseMindCreateCardModal({
  open,
  onClose,
  onSubmit,
}: EaseMindAccessModalProps): ReactElement {
  const [snackbarData, setSnackbarData] = useState<SnackbarData | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { user } = useUser();
  const { createCard, loading, error } = useCreateCardBank();

  const methods = useForm({
    defaultValues: {
      name: "",
      functions: [],
      variant: "",
    },
  });

  const handleCreateCard = async (data: any) => {
    if (!user?._id) return;

    const result = await createCard({
      userId: user._id,
      name: data.name,
      functions: data.functions,
      variant: data.variant,
    });

    if (result) {
      setSnackbarData({
        status: "success",
        message: "Cartão criado com sucesso!",
      });

      onSubmit?.({ status: "success", data: result });
      methods.reset();
      onClose();
    } else {
      setSnackbarData({
        status: "error",
        message: error ?? "Erro ao criar cartão.",
      });
    }

    setSnackbarOpen(true);
  };

  return (
    <>
      <EaseMindModal
        title="Criação do novo cartão"
        open={open}
        illustrationShow
        onClose={() => onClose()}
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleCreateCard)}>
            <EaseMindInputController
              name="name"
              label="Nome do cartão"
              placeholder="Ex: Cartão Nubank"
              rules={{ required: "Nome é obrigatório" }}
            />

            <Controller
              name="functions"
              control={methods.control}
              rules={{ required: "Selecione pelo menos uma função" }}
              render={({ field, fieldState }) => (
                <EaseMindSelect
                  {...field}
                  multiple
                  label="Função"
                  options={functionOptions}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Controller
              name="variant"
              control={methods.control}
              rules={{ required: "Selecione o tipo do cartão" }}
              render={({ field, fieldState }) => (
                <EaseMindSelect
                  {...field}
                  label="Tipo do cartão"
                  options={variantOptions}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Box mt={2}>
              <EaseMindButton
                label="Criar cartão"
                color="secondary"
                variant="contained"
                loading={loading}
                fullWidth
                type="submit"
              />
            </Box>
          </form>
        </FormProvider>
      </EaseMindModal>

      <EaseMindSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        data={snackbarData}
      />
    </>
  );
}
