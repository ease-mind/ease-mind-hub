import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { EasemindTabs } from './tabs';
import { EasemindText } from '../text/text';
import { Box } from '@mui/material';
import { useState } from 'react';

const meta = {
  title: 'Components/Tabs',
  component: EasemindTabs,
  tags: ['autodocs'],
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
} satisfies Meta<typeof EasemindTabs>;

export default meta;

type Story = StoryObj<typeof EasemindTabs>;

export const TwoTabs: Story = {
  args: {
    options: [
      { label: 'Tab 1', id: 'tab1' },
      { label: 'Tab 2', id: 'tab2' },
    ],
    onChangeTab: (id) => console.log('Selected tab:', id),
    children:
      <Box py={2}>
        <EasemindText variant="md">Content for the selected tab</EasemindText>
      </Box>
  },
};

export const ThreeTabs: Story = {
  args: {
    options: [
      { label: 'Overview', id: 'overview' },
      { label: 'Details', id: 'details' },
      { label: 'Settings', id: 'settings' },
    ],
    onChangeTab: (id) => console.log('Selected tab:', id),
    children:
      <Box py={2}>
        <EasemindText variant="md">Tab content goes here</EasemindText>
        <EasemindText variant="sm" sx={{ mt: 2 }}>
          This is where you would display different content based on the selected tab.
        </EasemindText>
      </Box>
  },
};

export const FourTabs: Story = {
  args: {
    options: [
      { label: 'Home', id: 'home' },
      { label: 'Profile', id: 'profile' },
      { label: 'Messages', id: 'messages' },
      { label: 'Settings', id: 'settings' },
    ],
    onChangeTab: (id) => console.log('Selected tab:', id),
    children:
      <Box py={2}>
        <EasemindText variant="lg">Welcome!</EasemindText>
        <EasemindText variant="sm" sx={{ mt: 1 }}>
          Navigate between tabs to see different content.
        </EasemindText>
      </Box>
  },
};

export const WithDynamicContent: Story = {
  render: (args) => {
    const [selectedTab, setSelectedTab] = useState('tab1');

    const contentMap: Record<string, React.ReactNode> = {
      tab1:
        <Box py={2}>
          <EasemindText variant="lg">Tab 1 Content</EasemindText>
          <EasemindText variant="sm" sx={{ mt: 1 }}>
            This is the content for the first tab.
          </EasemindText>
        </Box>,
      tab2:
        <Box py={2}>
          <EasemindText variant="lg">Tab 2 Content</EasemindText>
          <EasemindText variant="sm" sx={{ mt: 1 }}>
            This is the content for the second tab.
          </EasemindText>
        </Box>,
      tab3:
        <Box py={2}>
          <EasemindText variant="lg">Tab 3 Content</EasemindText>
          <EasemindText variant="sm" sx={{ mt: 1 }}>
            This is the content for the third tab.
          </EasemindText>
        </Box>,
    };

    return (
      <EasemindTabs
        {...args}
        onChangeTab={(id) => setSelectedTab(id)}
      >
        {contentMap[selectedTab]}
      </EasemindTabs>
    );
  },
  args: {
    options: [
      { label: 'First', id: 'tab1' },
      { label: 'Second', id: 'tab2' },
      { label: 'Third', id: 'tab3' },
    ],
  },
};
