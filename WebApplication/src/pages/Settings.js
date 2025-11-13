import React, { useEffect, useState } from "react";
import { getApiBaseUrl } from "../services/apiClient";

// PUBLIC_INTERFACE
export default function Settings() {
  /** Settings screen placeholder with environment info. */
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute("data-theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <section aria-labelledby="settings-title" style={{ display: "grid", gap: 16 }}>
      <h1 id="settings-title">Settings</h1>
      <div>
        <label htmlFor="theme">Theme</label>{" "}
        <select id="theme" value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div role="region" aria-label="Environment info" style={{ fontSize: 12, opacity: 0.8 }}>
        <div>API Base: {getApiBaseUrl() || "(not set)"}</div>
        <div>Frontend URL: {process.env.REACT_APP_FRONTEND_URL || "(not set)"} </div>
        <div>Node Env: {process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV}</div>
      </div>
    </section>
  );
}
