<div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
  {currentOrder.map((id, index) => {
    const user = users.find((u) => u.id === id);

    const isCurrentTurn = index === currentTurnIndex;
    const isYou = id === currentUserId;

    return (
      <div
        key={id}
        style={{
          padding: "10px",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isCurrentTurn ? "#4caf50" : "#ccc",
          color: "white",
          border: isYou ? "3px solid blue" : "none",
          fontWeight: "bold"
        }}
      >
        {user.name[0]}
      </div>
    );
  })}
</div>

import { useState } from "react";
import CalendarView from "./components/CalendarView";
import GameDetails from "./components/GameDetails";
import SelectedGamesList from "./components/SelectedGamesList";
import { users } from "./data/users";

function App() {
  // Draft state
  const [draftOrder, setDraftOrder] = useState([1, 2, 3, 4]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [round, setRound] = useState(1);

  // gameId -> userId
  const [pickedGames, setPickedGames] = useState({});

  // UI state
  const [selectedGameDetails, setSelectedGameDetails] = useState(null);

  // Get correct order (snake draft)
  const getCurrentDraftOrder = () => {
    return round % 2 === 1 ? draftOrder : [...draftOrder].reverse();
  };
  const [currentUserId, setCurrentUserId] = useState(1);
  const currentOrder = getCurrentDraftOrder();
  const currentPlayerId = currentOrder[currentTurnIndex];
  const currentUser = users.find((u => u.id === currentPlayerId);

  // CORE PICK FUNCTION
  const handlePick = (game) => {
  // not your turn
  if (currentUserId !== currentPlayerId) {
    alert("Not your turn!");
    return;
  }

  // already picked
  if (pickedGames[game.id]) return;

  setPickedGames((prev) => ({
    ...prev,
    [game.id]: currentPlayerId,
  }));

  // advance turn
  if (currentTurnIndex === draftOrder.length - 1) {
    setCurrentTurnIndex(0);
    setRound((prev) => prev + 1);
  } else {
    setCurrentTurnIndex((prev) => prev + 1);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dodgers Draft</h1>

      {/* Current Turn Info */}
      <h2>Current Turn: {currentUser?.name}</h2>
      <p>Round: {round}</p>

      {/* Draft Order */}
      <h3>Draft Order</h3>
      <ul>
        {currentOrder.map((id, index) => {
          const user = users.find((u) => u.id === id);
          return (
            <li
              key={id}
              style={{
                fontWeight:
                  index === currentTurnIndex ? "bold" : "normal",
              }}
            >
              {user.name}
            </li>
          );
        })}
      </ul>

      <h3>You Are:</h3>
        <select
        value={currentUserId}
        onChange={(e) => setCurrentUserId(Number(e.target.value))}
        >
        {users.map((user) => (
            <option key={user.id} value={user.id}>
            {user.name}
            </option>
        ))}
        </select>

      {/* Calendar */}
      <CalendarView
        handlePick={handlePick}
        pickedGames={pickedGames}
        currentPlayerId={currentPlayerId}
        currentUserId={currentUserId}
        setSelectedGameDetails={setSelectedGameDetails}
       />
      {/* Game Details */}
      <GameDetails game={selectedGameDetails} />

      {/* Picks Per User (simple version) */}
      <SelectedGamesList pickedGames={pickedGames} />
    </div>
  );
}

export default App;