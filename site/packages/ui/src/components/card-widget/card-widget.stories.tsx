import CreditCardIcon from "@mui/icons-material/CreditCard";
import { Meta, StoryObj } from "@storybook/react";
import { CardWidget } from "./card-widget";
import * as DocBlock from '@storybook/blocks';

const meta = {
  title: "Components/CardWidget",
  component: CardWidget,
  tags: ["autodocs"],
  parameters: {
           docs: {
          page: () =>
            <>
            <DocBlock.Title />
            <DocBlock.Description />
            
            <DocBlock.Primary />
            <DocBlock.Controls />
  
            <DocBlock.Title>Variações</DocBlock.Title>
            <DocBlock.Stories />
            </>
        }
      }
  } satisfies Meta<typeof CardWidget>;

export default meta;

type Story = StoryObj<typeof CardWidget>;

export const totalCards: Story = {
  args: {
    title: "Total de Cartões",
    value: "4",
    icon: <CreditCardIcon />,
  },
};

export const UsageLimit: Story = {
  args: {
    title: "Limite usado",
    value: "R$450,00",
    icon: <CreditCardIcon />,
  },
};

export const MonthlyExpense: Story = {
  args: {
    title: "Gasto mensal",
    value: "R$450,00",
    icon: <CreditCardIcon />,
  },
};