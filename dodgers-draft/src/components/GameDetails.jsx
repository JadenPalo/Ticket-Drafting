function GameDetail({ game }) {
	if (!game) return null;

	return 
		<div>
			<h3>{game.opponent}</h3>
			<p>Date: {game.date}</p>
			<p>Time: {game.time}</p>
			<p>Giveaway: {game.giveaway}</p>
		</div>
	);
}

export default GameDetails;