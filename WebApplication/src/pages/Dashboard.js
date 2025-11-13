import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Summary dashboard with period selector and breakdown by category. */
  const { actions } = useApp();
  const [period, setPeriod] = useState("month");
  const [summary, setSummary] = useState({ total: 0, byCategory: {} });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const s = await actions.getSummary({ period });
      if (!cancelled) setSummary(s);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [period, actions]);

  const categories = Object.entries(summary.byCategory || {});

  return (
    <section aria-labelledby="dashboard-title">
      <h1 id="dashboard-title">Dashboard</h1>
      <label htmlFor="period">Period</label>
      <select id="period" value={period} onChange={(e) => setPeriod(e.target.value)} style={{ marginLeft: 8 }}>
        <option value="week">This week</option>
        <option value="month">This month</option>
        <option value="year">This year</option>
      </select>

      <div style={{ marginTop: 16, padding: 12, border: "1px solid var(--border-color)", borderRadius: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Total: {summary.total?.toFixed ? summary.total.toFixed(2) : Number(summary.total || 0).toFixed(2)}</div>
        <ul aria-label="Totals by category">
          {categories.length === 0 ? (
            <li>No data</li>
          ) : (
            categories.map(([cat, val]) => (
              <li key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span>{cat}</span>
                <span>{Number(val).toFixed(2)}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
