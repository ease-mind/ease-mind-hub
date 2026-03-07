import React from "react";
import type { Preview } from "@storybook/react-vite";
import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom";
import { EasemindThemeProvider } from "@repo/utils";
import { UserProvider } from "@repo/data-access";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

export const withTheme = (Story) => {
  return (
    <Router>
      <EasemindThemeProvider>
        <UserProvider>
          <CssBaseline />
          <Story />
        </UserProvider>
      </EasemindThemeProvider>
    </Router>
  );
};

export const decorators = [withTheme];
