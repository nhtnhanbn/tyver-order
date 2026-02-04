import { useState } from "react";
import { Generator } from "../../../../components/Generator";
import importedConfiguration from "./configuration.json";

function App() {
	const [configuration, _] = useState(importedConfiguration);
	
	return (
		<Generator key={JSON.stringify(configuration)} configuration={configuration} />
	);
}

export { App };