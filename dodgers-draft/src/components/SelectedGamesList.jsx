import { users } from "../data/users";

function SelectedGamesList({ pickedGames }) {
  if (!pickedGames) return <div>No picks yet</div>;

  const entries = Object.entries(pickedGames);

  return (
    <div>
      <h3>Picked Games</h3>

      {entries.length === 0 && <p>No picks yet</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {entries.map(([gameId, userId]) => {
          const user = users.find((u) => u.id === userId);

          return (
            <li
              key={gameId}
              style={{
                padding: "8px",
                marginBottom: "5px",
                background: "#fff",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>Game {gameId}</span>
              <strong>{user?.name}</strong>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SelectedGamesList;