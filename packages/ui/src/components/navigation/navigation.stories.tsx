import { Meta, StoryFn } from "@storybook/react";
import { EaseMindNavigation, EaseMindNavigationProps } from "./navigation";

export default {
  title: "Components/Navigation",
  component: EaseMindNavigation,
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
    onPrev: { action: "clicked previous" },
    onNext: { action: "clicked next" },
  },
} as Meta;

const Template: StoryFn<EaseMindNavigationProps> = (args) => <EaseMindNavigation {...args} />;

export const Default = Template.bind({});
Default.args = {
  size: "medium",
};