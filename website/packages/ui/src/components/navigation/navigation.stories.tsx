import { Meta, StoryFn } from "@storybook/react";
import { EasemindNavigation, EasemindNavigationProps } from "./navigation";

export default {
  title: "Components/Navigation",
  component: EasemindNavigation,
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
    onPrev: { action: "clicked previous" },
    onNext: { action: "clicked next" },
  },
} as Meta;

const Template: StoryFn<EasemindNavigationProps> = (args) => <EasemindNavigation {...args} />;

export const Default = Template.bind({});
Default.args = {
  size: "medium",
};