import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	base: "/order/",
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
				custom: resolve(__dirname, "custom/index.html"),
				configurations: resolve(__dirname, "custom/configurations/index.html"),
				vic2022BtlNorthEasternMetropolitan: resolve(__dirname, "vic/2022/btl/north-eastern-metropolitan/index.html")
			}
		}
	}
});