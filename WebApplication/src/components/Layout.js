import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Layout({ children }) {
  const { state, actions } = useApp();

  return (
    <div className="App" role="application">
      <nav
        className="navbar"
        aria-label="Primary"
        style={{
          display: "flex",
          gap: 16,
          padding: 12,
          borderBottom: "1px solid var(--border-color)",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg-secondary)",
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none", color: "var(--text-primary)", fontWeight: 700 }}>
            Expense Tracker
          </Link>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/expenses">Expenses</NavLink>
          <NavLink to="/auth">Auth</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span aria-live="polite" style={{ fontSize: 12, opacity: 0.8 }}>
            {state.user ? `Signed in: ${state.user.email}` : "Not signed in"}
          </span>
          {state.user ? (
            <button className="theme-toggle" onClick={actions.logout} aria-label="Sign out">
              Sign out
            </button>
          ) : null}
        </div>
      </nav>
      <main className="container" style={{ padding: 16 }}>{children}</main>
      <footer style={{ padding: 12, borderTop: "1px solid var(--border-color)", fontSize: 12, opacity: 0.8 }}>
        <span>Feature Flags: {JSON.stringify(state.featureFlags)}</span>
      </footer>
    </div>
  );
}
