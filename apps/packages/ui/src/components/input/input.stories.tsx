import { useState } from "react";
import type { Meta, StoryFn } from "@storybook/react";
import { EaseMindInput } from "./input";
import * as DocBlock from "@storybook/blocks";

export default {
  title: "Components/Input",
  component: EaseMindInput,
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
} as Meta<typeof EaseMindInput>;

const Template: StoryFn<typeof EaseMindInput> = (args) => {
  const [value, setValue] = useState("");

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  return <EaseMindInput {...args} value={value} onChange={handleChange} />;
};

export const Default = Template.bind({});
Default.args = {
  label: "Nome",
  placeholder: "Digite seu nome",
  type: "text",
  error: false,
  helperText: "",
};

export const WithError = Template.bind({});
WithError.args = {
  label: "Email",
  placeholder: "Digite seu email",
  type: "email",
  error: true,
  helperText: "Email inválido",
};
