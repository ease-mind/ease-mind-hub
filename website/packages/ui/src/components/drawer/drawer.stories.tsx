import * as DocBlock from '@storybook/blocks';
import { Meta, StoryObj } from '@storybook/react';
import { EaseMindDrawer } from './drawer';
import { useState } from 'react';
import { EaseMindButton } from '../button/button';
import { EaseMindText } from '../text/text';
import { Box } from '@mui/material';

const meta = {
  title: 'Components/Drawer',
  component: EaseMindDrawer,
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
} satisfies Meta<typeof EaseMindDrawer>;

export default meta;

type Story = StoryObj<typeof EaseMindDrawer>;

export const Right: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <EaseMindButton label="Open Right Drawer" onClick={() => setOpen(true)} color="primary" />
        <EaseMindDrawer
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
        <EaseMindText variant="md">This is the drawer content</EaseMindText>
        <EaseMindText variant="sm" sx={{ mt: 2 }}>
          You can put any content here, including forms, lists, or other components.
        </EaseMindText>
      </Box>
  },
};

export const Left: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <EaseMindButton label="Open Left Drawer" onClick={() => setOpen(true)} color="primary" />
        <EaseMindDrawer
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
        <EaseMindText variant="md">Navigation Menu</EaseMindText>
        <EaseMindText variant="sm" sx={{ mt: 2 }}>
          - Home
          <br />
          - Profile
          <br />
          - Settings
          <br />
          - Logout
        </EaseMindText>
      </Box>
  },
};

export const WithForm: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <EaseMindButton label="Open Form Drawer" onClick={() => setOpen(true)} color="primary" />
        <EaseMindDrawer
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
        <EaseMindText variant="sm">Fill in the form below to create a new item.</EaseMindText>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <EaseMindButton label="Submit" variant="contained" color="primary" />
          <EaseMindButton label="Cancel" variant="outlined" color="secondary" />
        </Box>
      </Box>
  },
};
