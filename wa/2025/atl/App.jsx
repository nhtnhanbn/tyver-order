import { useState } from "react";
import { Generator } from "../../../components/Generator";
import importedConfiguration from "/wa/2025/atl/configuration.json?url&raw";

function App() {
	const [configuration, _] = useState(JSON.parse(importedConfiguration));
	
	return (
		<>
			<a href="/">Home</a>
			<h1>Western Australian state election 2025 - Legislative Council - above the line</h1>
			<Generator key={JSON.stringify(configuration)} configuration={configuration} />
		</>
	);
}

export { App };