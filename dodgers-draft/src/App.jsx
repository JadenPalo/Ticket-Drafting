import { useState } from "react";
import CalendarView from "./components/CalendarView";
import GameDetails from "./components/GameDetails";
import SelectedGamesList from "./components/SelectedGamesList";

function App() {
	const [selectedGamesList, setSelectedGames] = useState([]);
	const [selectedGameDetails, setSelectedGameDetails] = useState(null);

	return (
		<div>
			<h1>Dodger Ticket Draft</h1>

			<CalendarView
				selectedGames={selectedGames}
				setSelectedGames={setSelectedGames}
				setSelectedGameDetails={setSelectedGameDetails}
			/>

			<GameDetails game={selectedGameDetails} />

			<SelectedGamesList selectedGames={selectedGames} />
			</div>
	);
}

export default App;

