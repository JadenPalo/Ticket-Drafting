export default function GameDetails({ game, handlePick, pickedGames, isMyTurn }) {
  if (!game) return <p>Select a game to see details</p>;

  const isPicked = pickedGames?.[game.id];

  return (
    <div>
      <h3>{game.opponent}</h3>
      <p>{game.date}</p>
      <button
        onClick={() => handlePick(game)}
        disabled={isPicked || !isMyTurn}
      >
        {isPicked ? "Already Picked" : isMyTurn ? "Pick Game" : "Not Your Turn"}
      </button>
    </div>
  );
}