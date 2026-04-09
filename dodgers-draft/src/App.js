import { useEffect, useState } from "react";
import CalendarView from "./components/CalendarView";
import GameDetails from "./components/GameDetails";
import SelectedGamesList from "./components/SelectedGamesList";
import { users } from "./data/users";

function App() {
  // Draft state
  const [draftOrder] = useState([1, 2, 3, 4]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [round, setRound] = useState(1);

  // gameId -> userId
  const [pickedGames, setPickedGames] = useState({});
  const [games, setGames] = useState([]);

  // UI state
  const [selectedGameDetails, setSelectedGameDetails] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(1);

  // Snake draft order
  const getCurrentDraftOrder = () => {
    return round % 2 === 1
      ? draftOrder
      : [...draftOrder].reverse();
  };

  const currentOrder = getCurrentDraftOrder();
  const currentPlayerId = currentOrder[currentTurnIndex];
  const currentUser = users.find((u) => u.id === currentPlayerId);

 useEffect(() => {
      const fetchGames = async () => {
        try {
          const res = await fetch(
            "https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=119&season=2026"
          );
          const data = await res.json();
          console.log("API DATA:", data);

          const parsedGames = data.dates.flatMap((dateObj) =>
              dateObj.games
                .filter(
                  (g) =>
                    g.teams.home?.team?.name === "Los Angeles Dodgers" &&
                    g.gameType === "R" // only regular season
                )
                .map((g) => {
                  const awayTeam = g.teams.away.team.name;

                  return {
                    id: g.gamePk,
                    date: dateObj.date, // YYYY-MM-DD
                    opponent: awayTeam, // always the away team for home games
                    home: true,
                    time: g.gameDate,
                  };
                })
          );
          setGames(parsedGames);
        } catch (err) {
          console.error("Error fetching games:", err);
        }
      };

      fetchGames();
    }, []);

  console.log(games);

  // Pick logic
  const handlePick = (game) => {
    if (!game) return;

    // Not your turn
    if (currentUserId !== currentPlayerId) {
      alert("Not your turn!");
      return;
    }

    // Already picked
    if (pickedGames[game.id]) return;

    // Save pick
    setPickedGames((prev) => ({
      ...prev,
      [game.id]: currentPlayerId,
    }));

    // Advance turn
    if (currentTurnIndex === draftOrder.length - 1) {
      setCurrentTurnIndex(0);
      setRound((prev) => prev + 1);
    } else {
      setCurrentTurnIndex((prev) => prev + 1);
    }
  };

  return (
  <div style={{ padding: "20px", fontFamily: "Arial" }}>
    <h1 style={{ marginBottom: "10px" }}>Dodgers Draft</h1>

    {/* Top Bar */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <div>
        <h2 style={{ margin: 0 }}>
          Current Turn: {currentUser?.name}
        </h2>
        <p style={{ margin: 0 }}>Round: {round}</p>
      </div>

      {/* Profile Turn Bar */}
      <div style={{ display: "flex", gap: "10px" }}>
        {currentOrder.map((id, index) => {
          const user = users.find((u) => u.id === id);
          const isCurrentTurn = index === currentTurnIndex;
          const isYou = id === currentUserId;

          return (
            <div
              key={id}
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isCurrentTurn ? "#4caf50" : "#ccc",
                color: "white",
                border: isYou ? "3px solid #2196f3" : "none",
                fontWeight: "bold",
              }}
            >
              {user?.name?.[0]}
            </div>
          );
        })}
      </div>
    </div>

    {/* Main Layout */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "250px 1fr 300px",
        gap: "20px",
      }}
    >
      {/* LEFT: Picks */}
      <div
        style={{
          padding: "15px",
          borderRadius: "10px",
          background: "#f5f5f5",
        }}
      >
        <SelectedGamesList pickedGames={pickedGames} />
      </div>

      {/* CENTER: Calendar */}
      <div
        style={{
          padding: "15px",
          borderRadius: "10px",
          background: "#ffffff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <CalendarView
          games={games}
          handlePick={handlePick}
          pickedGames={pickedGames}
          currentPlayerId={currentPlayerId}
          currentUserId={currentUserId}
          setSelectedGameDetails={setSelectedGameDetails}
        />
      </div>

      {/* RIGHT: Details */}
      <div
        style={{
          padding: "15px",
          borderRadius: "10px",
          background: "#f5f5f5",
        }}
      >
        <h3>You Are:</h3>
        <select
          value={currentUserId}
          onChange={(e) => setCurrentUserId(Number(e.target.value))}
          style={{ width: "100%", marginBottom: "20px" }}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <GameDetails 
          game={selectedGameDetails}
          handlePick={handlePick}
          pickedGames={pickedGames}
        />
      </div>
    </div>
  </div>
);
}

export default App;