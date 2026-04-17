import { getFirestore, doc, setDoc, addDoc, collection, updateDoc, onSnapshot, arrayUnion } from "firebase/firestore";
import app from "./firebase";

const db = getFirestore(app);

// USERS
export const createUserProfile = async (user) => {
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    createdAt: new Date()
  });
};

// ROOMS
export const createRoom = async (userId) => {
  const ref = await addDoc(collection(db, "rooms"), {
    hostId: userId,
    users: [userId],
    status: "waiting",
    draftOrder: [],
    currentTurn: 0
  });

  return ref.id;
};

export const joinRoom = async (roomId, userId) => {
  await updateDoc(doc(db, "rooms", roomId), {
    users: arrayUnion(userId)
  });
};

export const startDraft = async (roomId, users) => {
  const shuffled = [...users].sort(() => Math.random() - 0.5);

  await updateDoc(doc(db, "rooms", roomId), {
    status: "drafting",
    draftOrder: shuffled,
    currentTurn: 0
  });
};

export const subscribeToRoom = (roomId, callback) => {
  return onSnapshot(doc(db, "rooms", roomId), (doc) => {
    callback(doc.data());
  });
};

export default db;