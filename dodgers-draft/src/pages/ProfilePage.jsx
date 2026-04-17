import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import db from "../firebase/firestore";

export default function ProfilePage({ user, setHasProfile }) {
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");

  const handleSave = async () => {
    await setDoc(
        doc(db, "users", user.uid),
        {
            username,
            photoURL:
                image || `https://ui-avatars.com/api/?name=${username}`,
    },
    { merge: true }
  );

  setHasProfile(true);
};

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Your Profile</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <input
          placeholder="Profile Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
      />

      <br /><br />

      <button onClick={handleSave}>Save Profile</button>
    </div>
  );
}