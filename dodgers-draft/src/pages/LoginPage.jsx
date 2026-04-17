import AuthForm from "../components/AuthForm";

export default function LoginPage({ setUser }) {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Dodgers Draft App</h1>
      <AuthForm setUser={setUser} />
    </div>
  );
}