import Calendar from "react-calendar";
import "react-Calendar/dist/Calendar.css";
import { useState } from "react";
import { games } from "./games";

<Calendar
	onClickDay={handleClickDay}
	titleClassName={({ date }) => {
		const dateStr = date.toISOString().split("T")[0];
		const game = games.find(g => g.date === dateStr);

		if (!game) return "no-game"; //grey
		if (selectedGames.includes(game.id)) return "selected"l //green
		return "avaliable"; //white
	}}
/>


function App() {
	const [selectedGames, setSelectedGames] = useState([]);

	const handleClickDay = (date) => {
		const dateStr = date.toISOString().split("T")[0];

		const game = games.find(g => g.date === dateStr);

		if (!game) return;

		if (selectedGames.includes(game.id)) {
			setSelectedGames(selectedGames.filter(id => id !== game.id));
		} else {
			setSelectedGames([...selectedGames, game.id]);
		}
	};

	return (
		<div>
		<h1>Dodgers Draft</h1>
		<Calendar onClickDay = {handleClickDay} />
		</div>
		);
}

export default App;



