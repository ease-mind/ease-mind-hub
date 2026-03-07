import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { EasemindDrawer } from './drawer';
import { useState } from 'react';
import { EasemindButton } from '../button/button';
import { EasemindText } from '../text/text';
import { Box } from '@mui/material';

const meta = {
  title: 'Components/Drawer',
  component: EasemindDrawer,
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
} satisfies Meta<typeof EasemindDrawer>;

export default meta;

type Story = StoryObj<typeof EasemindDrawer>;

export const Right: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <EasemindButton label="Open Right Drawer" onClick={() => setOpen(true)} color="primary" />
        <EasemindDrawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
  args: {
    title: 'Drawer Title',
    anchor: 'right',
    children:
      <Box>
        <EasemindText variant="md">This is the drawer content</EasemindText>
        <EasemindText variant="sm" sx={{ mt: 2 }}>
          You can put any content here, including forms, lists, or other components.
        </EasemindText>
      </Box>
  },
};

export const Left: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <EasemindButton label="Open Left Drawer" onClick={() => setOpen(true)} color="primary" />
        <EasemindDrawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
  args: {
    title: 'Left Menu',
    anchor: 'left',
    children:
      <Box>
        <EasemindText variant="md">Navigation Menu</EasemindText>
        <EasemindText variant="sm" sx={{ mt: 2 }}>
          - Home
          <br />
          - Profile
          <br />
          - Settings
          <br />
          - Logout
        </EasemindText>
      </Box>
  },
};

export const WithForm: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <EasemindButton label="Open Form Drawer" onClick={() => setOpen(true)} color="primary" />
        <EasemindDrawer
          {...args}
          open={open}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
  args: {
    title: 'Create New Item',
    anchor: 'right',
    children:
      <Box display="flex" flexDirection="column" gap={2}>
        <EasemindText variant="sm">Fill in the form below to create a new item.</EasemindText>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <EasemindButton label="Submit" variant="contained" color="primary" />
          <EasemindButton label="Cancel" variant="outlined" color="secondary" />
        </Box>
      </Box>
  },
};
