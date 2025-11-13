import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Home() {
  /** Home landing page linking to key modules. */
  return (
    <section aria-labelledby="home-title" style={{ display: "grid", gap: 12 }}>
      <h1 id="home-title">Welcome to Expense Tracker</h1>
      <p>Track, categorize, and analyze your spending.</p>
      <div style={{ display: "flex", gap: 8 }}>
        <Link className="App-link" to="/dashboard">Go to Dashboard</Link>
        <Link className="App-link" to="/expenses">Manage Expenses</Link>
        <Link className="App-link" to="/settings">Settings</Link>
      </div>
    </section>
  );
}
