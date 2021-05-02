import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import path from "path";

import { peerDependencies } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: { entry: path.resolve(__dirname, "src/lib.tsx"), name: "TimadaUI" },
    rollupOptions: {
      external: Object.keys(peerDependencies),
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-router-dom": "ReactRouterDOM",
          "react-intl": "ReactIntl",
          "ss-search": "SsSearch",
          "@chakra-ui/react": "ChakraUI",
          "valtio": "Valtio",
        },
      },
    },
  },

  resolve: {
    alias: [
      { find: /^(lib|theme)/, replacement: "/src/$1" },
      { find: /^(routes|components|utils)\//, replacement: "/src/$1/" },
    ],
  },

  plugins: [reactRefresh()],
});
