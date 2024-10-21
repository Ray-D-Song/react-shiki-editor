import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import dts from "vite-plugin-dts"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dts({
    tsconfigPath: "tsconfig.lib.json"
  })],
  build: {
    lib: {
      entry: "lib/index.tsx",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react"],
    }
  }
})
