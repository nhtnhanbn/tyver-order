import { useState } from "react";
import { Generator } from "../components/Generator";
import "./App.css";

function App() {
	const [configuration, setConfiguration] = useState({
		minSaved: 0,
		minFormal: 0,
		groupsPerRow: 0,
		data: {}
	});
	
	return (
		<>
			<label htmlFor="configuration">Paste your configuration:</label>
			<textarea id="configuration"></textarea>
			<button
				onClick={
					() => {
						setConfiguration(JSON.parse(document.querySelector("#configuration").value))
					}
				}
			>Apply configuration</button>
			<br />
			<Generator key={JSON.stringify(configuration)} configuration={configuration} />
		</>
	);
}

export { App };