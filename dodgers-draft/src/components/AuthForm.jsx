import { useState } from "react";
import {
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth, db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function AuthForm({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      
      await setPersistence(auth, browserLocalPersistence);

      if (isLogin) {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        setUser(cred.user);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", cred.user.uid), {
            username: email.split("@")[0],
            photoURL: "",
            email: cred.user.email,
        });
        setUser(cred.user);
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      <p style={styles.switchText}>
        {isLogin ? "Need an account?" : "Already have an account?"}{" "}
        <span style={styles.link} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Sign Up" : "Login"}
        </span>
      </p>
    </div>
  );
}

// 🎨 Simple styles (cleaner UI)
const styles = {
  container: {
    maxWidth: 320,
    margin: "60px auto",
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 12,
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  button: {
    padding: 10,
    borderRadius: 6,
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: 10,
    fontSize: "0.9rem",
  },
  switchText: {
    marginTop: 12,
    fontSize: "0.9rem",
  },
  link: {
    color: "#007bff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};