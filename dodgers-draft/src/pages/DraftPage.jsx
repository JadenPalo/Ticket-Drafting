import { useEffect, useState } from "react";
import CalendarView from "../components/CalendarView";
import GameDetails from "../components/GameDetails";
import SelectedGamesList from "../components/SelectedGamesList";
import {
  subscribeToRoom,
  subscribeToPlayers,
  pickGame,
  advanceTurn,
} from "../firebase/roomService";

export default function DraftPage({ user, roomId, games }) {
  // ✅ Real-time room state
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [selectedGameDetails, setSelectedGameDetails] = useState(null);

  // ✅ Subscribe to room updates
  useEffect(() => {
    if (!roomId) return;
    const unsubRoom = subscribeToRoom(roomId, setRoom);
    return unsubRoom;
  }, [roomId]);

  // ✅ Subscribe to players
  useEffect(() => {
    if (!roomId) return;
    const unsubPlayers = subscribeToPlayers(roomId, setPlayers);
    return unsubPlayers;
  }, [roomId]);

  // ✅ Pick logic with Firebase sync
  const handlePick = async (game) => {
    if (!game || !room) return;

    // Check if already picked
    if (room.pickedGames?.[game.id]) {
      alert("Game already picked!");
      return;
    }

    // Check if it's your turn
    const currentPlayerId = room.draftOrder?.[room.currentTurnIndex];
    if (currentPlayerId !== user.uid) {
      alert("Not your turn!");
      return;
    }

    try {
      // ✅ Save pick to Firebase
      await pickGame(roomId, game.id, user);
      
      // ✅ Advance to next turn
      await advanceTurn(roomId);
      
      // Clear selected game
      setSelectedGameDetails(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // Loading guards
  if (!games || games.length === 0) {
    return <p>Loading games...</p>;
  }

  if (!room) {
    return <p>Loading room...</p>;
  }

  if (players.length === 0) {
    return <p>Loading players...</p>;
  }

  // ✅ Get current player from room state
  const currentPlayerId = room.draftOrder?.[room.currentTurnIndex];
  const currentPlayer = players.find((p) => p.uid === currentPlayerId);

  // ✅ Calculate round based on picks
  const totalPicks = Object.keys(room.pickedGames || {}).length;
  const round = Math.floor(totalPicks / players.length) + 1;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Dodgers Draft</h1>

      {/* Top Bar */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h2>Current Turn: {currentPlayer?.username || currentPlayer?.email}</h2>
          <p>Round: {round}</p>
          <p style={{ fontSize: "12px", color: "#666" }}>
            {room.currentTurnIndex !== undefined && (
              <>Pick {room.currentTurnIndex + 1} of {players.length}</>
            )}
          </p>
        </div>

        {/* Avatar Row */}
        <div style={{ display: "flex", gap: "10px" }}>
          {room.draftOrder?.map((uid, index) => {
            const player = players.find((p) => p.uid === uid);
            const isCurrent = index === room.currentTurnIndex;

            return (
              <div
                key={uid}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: isCurrent ? "3px solid #4caf50" : "2px solid #ccc",
                }}
              >
                <img
                  src={player?.photoURL || "https://via.placeholder.com/50"}
                  alt="avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
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
          marginTop: "20px",
        }}
      >
        {/* LEFT */}
        <div style={{ background: "#f5f5f5", padding: "15px" }}>
          <SelectedGamesList 
            pickedGames={room.pickedGames || {}} 
            players={players}
          />
        </div>

        {/* CENTER */}
        <div style={{ background: "#fff", padding: "15px" }}>
          <CalendarView
            games={games}
            pickedGames={room.pickedGames || {}}
            currentUserId={user.uid}
            currentTurnUserId= {currentPlayerId}
            setSelectedGameDetails={setSelectedGameDetails}
          />
        </div>

        {/* RIGHT */}
        <div style={{ background: "#f5f5f5", padding: "15px" }}>
          <GameDetails
            game={selectedGameDetails}
            handlePick={handlePick}
            pickedGames={room.pickedGames || {}}
            isMyTurn={currentPlayerId === user.uid}
          />
        </div>
      </div>
    </div>
  );
}