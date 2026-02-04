import { useState } from "react";
import { Generator } from "../../../../components/Generator";
import importedConfiguration from "./configuration.json";

function App() {
	const [configuration, _] = useState(importedConfiguration);
	
	return (
		<>
			<a href="/">Home</a>
			<h1>Victorian state election 2022 - Legislative Council - below the line - North-Eastern Metropolitan Region</h1>
			<Generator key={JSON.stringify(configuration)} configuration={configuration} />
		</>
	);
}

export { App };