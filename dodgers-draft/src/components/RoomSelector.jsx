import { createRoom, joinRoom } from "../firebase/roomService";
import { useState } from "react";

function RoomSelector({ user, setRoomId }) {
  const [inputId, setInputId] = useState("");

  const handleCreate = async () => {
    const roomId = Math.random().toString(36).substring(2, 8);

    await createRoom(roomId, user);

    setRoomId(roomId); // ✅ MUST HAPPEN
  };

  const handleJoin = async () => {
    if (!inputId) return;

    await joinRoom(inputId, user);

    setRoomId(inputId);
  };

  return (
    <div>
      <h2>Create or Join Room</h2>

      <button onClick={handleCreate}>Create Room</button>

      <div style={{ marginTop: 10 }}>
        <input
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          placeholder="Enter Room ID"
        />
        <button onClick={handleJoin}>Join</button>
      </div>
    </div>
  );
}

export default RoomSelector;