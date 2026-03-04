import React from "react";
import type { Preview } from "@storybook/react-vite";
import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom";
import { EaseMindThemeProvider } from "@repo/utils";
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
      <EaseMindThemeProvider>
        <UserProvider>
          <CssBaseline />
          <Story />
        </UserProvider>
      </EaseMindThemeProvider>
    </Router>
  );
};

export const decorators = [withTheme];
