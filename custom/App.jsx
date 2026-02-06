import { useState } from "react";
import { Generator } from "../components/Generator";
import "./App.css";

const placeholder = {
	"title": "Sample election",
	"minSaved": 2,
	"minFormal": 4,
	"groupsPerRow": 2,
	"candidatesPerColumn": 1,
	"groups": {
		"Group A": [
			"Candidate 1",
			"Candidate 2"
		],
		"Group B": [
			"Candidate 3"
		]
	},
	"ungrouped": [
		"Candidate 4"
	]
};

function App() {
	const [configuration, setConfiguration] = useState(placeholder);
	
	return (
		<>
			<div className="config-label">
				<label htmlFor="configuration">Paste your configuration:</label>
				<a href="/order/custom/configurations/">What is a configuration?</a>
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