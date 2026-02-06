import { dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { writeFileSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getIndexHtml(title) {
	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>${title} - Tyver Order</title>
	</head>

	<body>
		<div id="root"></div>
		<script type="module" src="main.jsx"></script>
	</body>
</html>`;
}

function getMainJsx(configurationPath) {
	return `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Generator } from "/components/Generator";
import importedConfiguration from "${configurationPath}${"?url&raw"}";
import "/index.css";

const configuration = JSON.parse(importedConfiguration);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<a href="/order/">Home</a>
		<h1>${configurationPath}</h1>
		<Generator key={JSON.stringify(configuration)} configuration={configuration} />
	</StrictMode>,
);`;
}

function buildEntryHtml() {
	function traverse(dir) {
		for (const file of readdirSync(dir)) {
			const configurationPath = resolve(dir, file);
			if (statSync(configurationPath).isDirectory()) {
				traverse(configurationPath);
			} else if (file === "configuration.json") {
				const relativePath = dirname(relative("public", configurationPath));
				const buildPath = resolve(__dirname, "elections", relativePath);
				mkdirSync(buildPath, { recursive: true });
				writeFileSync(resolve(buildPath, "index.html"), getIndexHtml(relativePath));
				writeFileSync(resolve(buildPath, "main.jsx"), getMainJsx(configurationPath));
				input[relativePath] = resolve(buildPath, "index.html");
			}
		}
	}

	const input = {
		main: resolve(__dirname, "index.html"),
		custom: resolve(__dirname, "custom/index.html"),
		configurations: resolve(__dirname, "custom/configurations/index.html")
	};

	traverse(resolve(__dirname, "public"));

	return input;
}

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	base: "/order/",
	build: {
		rollupOptions: {
			input: buildEntryHtml()
		}
	}
});