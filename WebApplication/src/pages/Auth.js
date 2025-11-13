import React, { useState } from "react";
import { useApp } from "../context/AppContext";

// PUBLIC_INTERFACE
export default function Auth() {
  /** Simple login UI to demonstrate auth flow; no secrets stored. */
  const { state, actions } = useApp();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await actions.login(email, password);
    } catch (err) {
      // Non-sensitive feedback
      alert("Login failed");
    }
  };

  return (
    <section aria-labelledby="auth-title">
      <h1 id="auth-title">Sign in</h1>
      {state.user ? (
        <p>You are signed in as {state.user.email}.</p>
      ) : (
        <form onSubmit={onSubmit} aria-describedby="auth-help" style={{ maxWidth: 420 }}>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              data-testid="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              data-testid="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <p id="auth-help" style={{ fontSize: 12, opacity: 0.8 }}>
            This is a placeholder authentication screen. Do not enter real credentials.
          </p>
          <button className="theme-toggle" type="submit" disabled={state.loading} aria-busy={state.loading}>
            {state.loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      )}
    </section>
  );
}
