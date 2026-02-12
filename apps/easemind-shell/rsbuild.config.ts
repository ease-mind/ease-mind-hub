import { defineConfig, loadEnv } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSvgr } from "@rsbuild/plugin-svgr";
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { pluginSass } from "@rsbuild/plugin-sass";
import mfConfig from "./module-federation.config";

const { publicVars } = loadEnv({ prefixes: ["REACT_APP_", "PUBLIC_"] });

export default defineConfig({
  html: {
    template: "./public/index.html",
  },
  plugins: [
    pluginReact(),
    pluginSass(),
    pluginSvgr({ mixedImport: true }),
    pluginModuleFederation(mfConfig),
  ],
  source: {
    // Compile all JS files and exclude core-js
    include: [{ not: /[\\/]core-js[\\/]/ }],
    define: publicVars,
  },
});
