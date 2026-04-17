import { useEffect, useState } from "react";
import { subscribeToRoom } from "../firebase/firestore";

export default function useRoom(roomId) {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    if (!roomId) return;

    const unsub = subscribeToRoom(roomId, setRoom);
    return unsub;
  }, [roomId]);

  return room;
}