import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "../index.css"
import { App } from "./App"

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<a href="/order/">Home</a>
		<h1>Ballot Builder</h1>
		<App />
	</StrictMode>,
)
