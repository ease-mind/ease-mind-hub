import { createModuleFederationConfig } from "@module-federation/rsbuild-plugin";
import pkg from "./package.json";
const { dependencies } = pkg;

export default createModuleFederationConfig({
  name: "tasks",
  exposes: {
    "./components": "./src/components/index.ts",
  },
  filename: "remoteEntry.js",
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
