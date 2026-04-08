import { games } from "../data/games";

function SelectedGamesList({ selectedGames }) {
	return (
		<div>
			<h2>Your Current Picks</h2>
			<ui>
				{selectedGames.map(id => {
					const game = games.find(g => g.id === id);
					return (
						<li key={id}>
							{game.date} vs {game.opponent}
						</li>
					);
				})}
			</ui>
		</div>
	);
}

export default SelectedGamesList;

