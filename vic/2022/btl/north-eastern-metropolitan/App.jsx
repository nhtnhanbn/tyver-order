import { useState } from "react";
import { Generator } from "../../../../components/Generator";
import importedConfiguration from "/vic-2022-btl-north-eastern-metropolitan.json?url&raw";

function App() {
	const [configuration, _] = useState(JSON.parse(importedConfiguration));
	
	return (
		<>
			<a href="/">Home</a>
			<h1>Victorian state election 2022 - Legislative Council - below the line - North-Eastern Metropolitan Region</h1>
			<Generator key={JSON.stringify(configuration)} configuration={configuration} />
		</>
	);
}

export { App };