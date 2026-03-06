import { createModuleFederationConfig } from "@module-federation/rsbuild-plugin";
import pkg from "./package.json";
const { dependencies } = pkg;

const TASKS_APP_URL = process.env.PUBLIC_TASKS_APP_URL;

export default createModuleFederationConfig({
  name: "easemind-web",
  remotes: {
    tasks: `tasks@${TASKS_APP_URL}/remoteEntry.js`,
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: dependencies.react,
      eager: true,
    },
    "react-dom": {
      singleton: true,
      requiredVersion: dependencies["react-dom"],
      eager: true,
    },
    "@mui/material": {
      singleton: true,
      requiredVersion: dependencies["@mui/material"],
    },
    "react-hook-form": {
      singleton: true,
      requiredVersion: dependencies["react-hook-form"],
    },
    "@emotion/react": {
      singleton: true,
      requiredVersion: dependencies["@emotion/react"],
    },
    "@emotion/styled": {
      singleton: true,
      requiredVersion: dependencies["@emotion/styled"],
    },
    "@repo/ui": {
      singleton: true,
    },
    "@repo/utils": {
      singleton: true,
    },
    "@repo/data-access": {
      singleton: true,
    },
  },
});
