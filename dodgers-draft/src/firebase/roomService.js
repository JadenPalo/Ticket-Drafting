import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  runTransaction,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

// ---------------------------
// CREATE ROOM
// ---------------------------
export const createRoom = async (roomId, user) => {
  const ref = doc(db, "rooms", roomId);

  await setDoc(ref, {
    name: "New Draft Room",
    host: user.uid,
    draftOrder: [],
    currentTurnIndex: 0,
    direction: 1,
    round: 1,
    pickedGames: {},
    status: "waiting",
    createdAt: Date.now(),
  });

  // Add host to players subcollection
  await setDoc(doc(db, "rooms", roomId, "players", user.uid), {
    uid: user.uid,
    email: user.email,
    username: user.username || "",
    photoURL: user.photoURL || "",
    joinedAt: Date.now(),
  });

  return roomId;
};

// ---------------------------
// JOIN ROOM
// ---------------------------
export const joinRoom = async (roomId, user) => {
  const ref = doc(db, "rooms", roomId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Room does not exist");
  }

  await setDoc(doc(db, "rooms", roomId, "players", user.uid), {
    uid: user.uid,
    email: user.email,
    username: user.username || "",
    photoURL: user.photoURL || "",
    joinedAt: Date.now(),
  });
};

// ---------------------------
// REAL-TIME ROOM
// ---------------------------
export const subscribeToRoom = (roomId, callback) => {
  const ref = doc(db, "rooms", roomId);

  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      callback(snap.data());
    }
  });
};

// ---------------------------
// REAL-TIME PLAYERS
// ---------------------------
export const subscribeToPlayers = (roomId, callback) => {
  const ref = collection(db, "rooms", roomId, "players");

  return onSnapshot(ref, (snap) => {
    const players = snap.docs.map((doc) => doc.data());
    callback(players);
  });
};

// ---------------------------
// UPDATE ROOM
// ---------------------------
export const updateRoom = async (roomId, data) => {
  await updateDoc(doc(db, "rooms", roomId), data);
};

// ---------------------------
// START DRAFT (🔥 BULLETPROOF)
// ---------------------------
export const startDraft = async (roomId) => {
  const playersSnap = await getDocs(
    collection(db, "rooms", roomId, "players")
  );

  let playerIds = playersSnap.docs.map((doc) => doc.data().uid);

  if (playerIds.length < 2) {
    throw new Error("Need at least 2 players to start draft");
  }

  // SHUFFLE (Fisher-Yates)
  for (let i = playerIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [playerIds[i], playerIds[j]] = [playerIds[j], playerIds[i]];
  }

  console.log("🎲 Random draft order:", playerIds);

  await updateRoom(roomId, {
    draftOrder: playerIds,
    currentTurnIndex: 0,
    direction: 1,
    status: "drafting",
  });
};

// ---------------------------
// PICK GAME (TURN + DUP CHECK)
// ---------------------------
export const pickGame = async (roomId, gameId, user) => {
  const ref = doc(db, "rooms", roomId);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);

    if (!snap.exists()) throw new Error("Room not found");

    const data = snap.data();

    const currentPlayer =
      data.draftOrder?.[data.currentTurnIndex];

    if (!currentPlayer) throw new Error("Draft not ready");

    if (currentPlayer !== user.uid) {
      throw new Error("Not your turn");
    }

    if (data.pickedGames?.[gameId]) {
      throw new Error("Game already picked");
    }

    transaction.update(ref, {
      [`pickedGames.${gameId}`]: user.uid,
    });
  });
};

// ---------------------------
// SNAKE TURN LOGIC (FIXED)
// ---------------------------
export const advanceTurn = async (roomId) => {
  const ref = doc(db, "rooms", roomId);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    const data = snap.data();

    let index = data.currentTurnIndex;
    let direction = data.direction ?? 1;
    const total = data.draftOrder.length;

    let nextIndex = index + direction;

    // RIGHT EDGE (last player)
    if (nextIndex >= total) {
      direction = -1;
      nextIndex = index; // stay on last player
    }

    // LEFT EDGE (first player)
    else if (nextIndex < 0) {
      direction = 1;
      nextIndex = index; // stay on first player
    }

    transaction.update(ref, {
      currentTurnIndex: nextIndex,
      direction,
    });
  });
};