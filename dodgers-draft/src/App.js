import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import LobbyPage from "./pages/LobbyPage";
import DraftPage from "./pages/DraftPage";
import ProfilePage from "./pages/ProfilePage";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase/firebase";
import useRoom from "./hooks/useRoom";

function App() {
  const [user, setUser] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [games, setGames] = useState([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // ✅ FIXED
  const room = useRoom(roomId);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const ref = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(ref);

          const profileData = snap.exists() ? snap.data() : {};

          const fullUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...profileData,
          };

          setUser(fullUser);
          setHasProfile(!!profileData.username);
        } catch (err) {
          console.error("Error loading user profile:", err);

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          });
        }
      } else {
        setUser(null);
        setRoomId(null);
        setHasProfile(false);
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(
          "https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=119&season=2026"
        );
        const data = await res.json();

        const parsedGames = data.dates.flatMap((dateObj) =>
          dateObj.games
            .filter(
              (g) =>
                g.teams.home?.team?.name === "Los Angeles Dodgers" &&
                g.gameType === "R"
            )
            .map((g) => ({
              id: g.gamePk,
              date: dateObj.date,
              opponent: g.teams.away.team.name,
              time: g.gameDate,
            }))
        );

        console.log("Games loaded:", parsedGames.length);
        setGames(parsedGames);
      } catch (err) {
        console.error("Error fetching games:", err);
      }
    };

    fetchGames();
  }, []);

  // ---------------------------
  // RENDER LOGIC
  // ---------------------------

  if (authLoading) {
    return <div style={{ textAlign: "center", marginTop: 50 }}>Loading...</div>;
  }

  if (!user) return <LoginPage setUser={setUser} />;

  if (user && !hasProfile) {
    return <ProfilePage user={user} setHasProfile={setHasProfile} />;
  }

  // 🔥 NOT IN ROOM
  if (!roomId) {
    return <LobbyPage user={user} setRoomId={setRoomId} />;
  }

  // 🔥 IN ROOM BUT NOT DRAFTING → STAY IN LOBBY
  if (!room || room.status !== "drafting") {
    return (
      <LobbyPage
        user={user}
        roomId={roomId}
        setRoomId={setRoomId}
      />
    );
  }

  // ✅ ONLY ENTER DRAFT WHEN READY
  return <DraftPage user={user} roomId={roomId} games={games} />;
}

export default App;