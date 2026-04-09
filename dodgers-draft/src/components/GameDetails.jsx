import { users } from "../data/users";

function GameDetails({ game, handlePick, pickedGames = {} }) {
  if (!game) {
    return (
      <div style={{ marginTop: "20px" }}>
        <h3>Select a game</h3>
      </div>
    );
  }

  const ownerId = pickedGames?.[game.id];
  const owner = users.find((u) => u.id === ownerId);
  const isPicked = !!ownerId;

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "15px",
        background: "#f5f5f5",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        maxWidth: "400px",
      }}
    >
      <h3>{game.opponent || "Dodgers Game"}</h3>

      <p><strong>Date:</strong> {game.date}</p>
      <p><strong>Time:</strong> {game.time || "TBD"}</p>
      <p><strong>Giveaway:</strong> {game.giveaway || "None"}</p>

      {isPicked && (
        <p style={{ color: "#2e7d32", fontWeight: "bold" }}>
          Picked by: {owner?.name}
        </p>
      )}

      <button
        onClick={() => handlePick(game)}
        disabled={isPicked}
        style={{
          marginTop: "10px",
          padding: "10px 15px",
          backgroundColor: isPicked ? "#999" : "#1976d2",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: isPicked ? "not-allowed" : "pointer",
          fontWeight: "bold",
          width: "100%",
        }}
      >
        {isPicked ? "Already Taken" : "Claim Game"}
      </button>
    </div>
  );
}

export default GameDetails;