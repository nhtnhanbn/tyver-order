import { useState } from "react";
import { Generator } from "../components/Generator";
import "./App.css";

const placeholder = {
	"minSaved": 2,
	"minFormal": 4,
	"groupsPerRow": 2,
	"candidatesPerColumn": 1,
	"data": {
		"Group A": [
			"Candidate 1",
			"Candidate 2"
		],
		"Group B": [
			"Candidate 3"
		],
		"Ungrouped": [
			"Candidate 4"
		]
	}
};

function App() {
	const [configuration, setConfiguration] = useState(placeholder);
	
	return (
		<>
			<h1>Tyver Order</h1>
			<div className="config-label">
				<label htmlFor="configuration">Paste your configuration:</label>
				<a href="configurations/">What is a configuration?</a>
			</div>
			<textarea
				id="configuration"
				placeholder={JSON.stringify(placeholder, null, 4)}
			></textarea>
			<button
				onClick={
					() => {
						try {
							if (confirm("Applying a new configuration will reset your preferences. Continue?")) {
								setConfiguration(JSON.parse(document.querySelector("#configuration").value));
							}
						} catch {
							alert("Invalid configuration");
						}
					}
				}
			>Apply configuration</button>
			<br />
			<Generator key={JSON.stringify(configuration)} configuration={configuration} />
		</>
	);
}

export { App };