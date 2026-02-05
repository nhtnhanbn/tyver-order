import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Generator } from "../../../components/Generator";
import importedConfiguration from "/wa/2025/btl/configuration.json?url&raw";
import "../../../index.css";

const configuration = JSON.parse(importedConfiguration);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<a href="/order/">Home</a>
		<h1>Victorian state election 2022 - Legislative Council - below the line - North-Eastern Metropolitan Region</h1>
		<Generator key={JSON.stringify(configuration)} configuration={configuration} />
	</StrictMode>,
);