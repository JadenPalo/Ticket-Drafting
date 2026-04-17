export default function SelectedGamesList({ pickedGames, players }) {
  return (
    <div>
      <h3>Picked Games</h3>
      {Object.entries(pickedGames || {}).map(([gameId, playerId]) => {
        const player = players?.find(p => p.uid === playerId);
        return (
          <div key={gameId}>
            Game {gameId} - {player?.username || player?.email}
          </div>
        );
      })}
    </div>
  );
}