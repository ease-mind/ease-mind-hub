import { Meta, StoryFn } from "@storybook/react";
import * as DocBlock from "@storybook/blocks";
import { EasemindSnackbar } from "./snackbar";
import { Box } from "@mui/material";
import { EasemindSnackbarProps } from "../../classes/models/snackbar";

export default {
  title: "Components/Snackbar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      page: () => (
        <>
          <DocBlock.Title />
          <DocBlock.Description />

          <DocBlock.Primary />
          <DocBlock.Controls />
          <DocBlock.Stories />
        </>
      ),
    },
  },
  argTypes: {
    open: {
      control: "boolean",
      defaultValue: true,
    },
    data: {
      control: "object",
      defaultValue: {
        status: "warning",
        message: "Tem certeza que deseja excluir este cartão?",
      },
    },
  },
} as Meta;

const SnackbarTemplate: StoryFn<typeof EasemindSnackbar> = (
  args: EasemindSnackbarProps,
) => {
  return (
    <Box py={4}>
      <EasemindSnackbar
        {...args}
        onClose={() => console.log("Fechar o componente snackbar.")}
      />
    </Box>
  );
};

export const SnackbarOnSuccess = SnackbarTemplate.bind({});
SnackbarOnSuccess.args = {
  open: true,
  data: {
    status: "success",
    message: "Cartão adicionado com sucesso!",
  },
};

export const SnackbarOnWarning = SnackbarTemplate.bind({});
SnackbarOnWarning.args = {
  open: true,
  data: {
    status: "warning",
    message: "Tem certeza que deseja excluir este cartão?",
  },
};

export const SnackbarOnError = SnackbarTemplate.bind({});
SnackbarOnError.args = {
  open: true,
  data: {
    status: "error",
    message: "Não foi possível remover o cartão!",
  },
};
