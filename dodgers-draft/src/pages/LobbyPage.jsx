import { useState, useEffect } from "react";
import {
  createRoom,
  joinRoom,
  subscribeToPlayers,
  subscribeToRoom,
  updateRoom,
} from "../firebase/roomService";

export default function LobbyPage({ user, roomId, setRoomId }) {
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);

  const [countdown, setCountdown] = useState(null);

  // ---------------------------
  // CREATE ROOM
  // ---------------------------
  const handleCreateRoom = async () => {
    setLoading(true);
    const newRoomId = Math.random().toString(36).substring(2, 8);

    await createRoom(newRoomId, user);
    setRoomId(newRoomId);

    setLoading(false);
  };

  // ---------------------------
  // JOIN ROOM
  // ---------------------------
  const handleJoinRoom = async () => {
    if (!joinCode) return;

    setLoading(true);
    try {
      await joinRoom(joinCode, user);
      setRoomId(joinCode);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  // ---------------------------
  // START DRAFT (WITH COUNTDOWN)
  // ---------------------------
  const handleStartDraft = () => {
    if (players.length < 2) {
      alert("Need at least 2 players");
      return;
    }

    setCountdown(5); // 5 second countdown
  };

  // ---------------------------
  // COUNTDOWN EFFECT
  // ---------------------------
  useEffect(() => {
      if (countdown === null) return;

      if (countdown === 0) {
        // ✅ USE REAL-TIME PLAYERS (NO FIRESTORE FETCH)
        const playerIds = players.map((p) => p.uid);

        console.log("Starting draft with players:", playerIds);

        if (playerIds.length < 2) {
          alert("Not enough players");
          setCountdown(null);
          return;
        }

        updateRoom(roomId, {
          draftOrder: playerIds,
          currentTurnIndex: 0,
          direction: 1,
          status: "drafting",
        });

        setCountdown(null);
        return;
      }

      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
  }, [countdown, roomId, players]);

  // ---------------------------
  // REAL-TIME ROOM
  // ---------------------------
  useEffect(() => {
    if (!roomId) return;
    return subscribeToRoom(roomId, setRoom);
  }, [roomId]);

  // ---------------------------
  // REAL-TIME PLAYERS
  // ---------------------------
  useEffect(() => {
    if (!roomId) return;
    return subscribeToPlayers(roomId, setPlayers);
  }, [roomId]);

  return (
    <div style={styles.container}>
      <h2>Lobby</h2>
      <p>Logged in as: {user.email}</p>

      {/* CREATE / JOIN */}
      {!roomId && (
        <>
          <button
            onClick={handleCreateRoom}
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Creating..." : "Create Room"}
          </button>

          <div style={{ marginTop: 20 }}>
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Room Code"
              style={styles.input}
            />
            <button
              onClick={handleJoinRoom}
              disabled={loading}
              style={styles.button}
            >
              {loading ? "Joining..." : "Join Room"}
            </button>
          </div>
        </>
      )}

      {/* ROOM VIEW */}
      {roomId && (
        <>
          <h3>Room Code: {roomId}</h3>

          {/* PLAYER COUNT */}
          <p>
            Players: {players.length}{" "}
            {players.length < 2 && "(waiting for more...)"}
          </p>

          {/* PLAYER LIST */}
          <div style={styles.playerList}>
            {players.map((p) => (
              <div key={p.uid} style={styles.playerCard}>
                <img
                  src={p.photoURL || "https://via.placeholder.com/40"}
                  alt="avatar"
                  style={styles.avatar}
                />
                <span>{p.username || p.email}</span>
              </div>
            ))}
          </div>

          {/* WAITING STATE */}
          {players.length < 2 && (
            <p style={{ marginTop: 20, color: "#888" }}>
              Waiting for more players to join...
            </p>
          )}

          {/* COUNTDOWN */}
          {countdown !== null && (
            <h2 style={{ marginTop: 20 }}>
              Draft starting in {countdown}...
            </h2>
          )}

          {/* START BUTTON */}
          {room?.host === user.uid &&
            players.length >= 2 &&
            countdown === null && (
              <button
                onClick={handleStartDraft}
                style={styles.button}
              >
                Start Draft
              </button>
            )}
        </>
      )}
    </div>
  );
}

// ---------------------------
// STYLES
// ---------------------------
const styles = {
  container: {
    textAlign: "center",
    marginTop: 50,
  },
  button: {
    marginTop: 10,
    padding: 10,
    cursor: "pointer",
  },
  input: {
    padding: 8,
    marginRight: 10,
  },
  playerList: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
  },
  playerCard: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 8,
    width: 220,
    transition: "all 0.2s ease",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
  },
};