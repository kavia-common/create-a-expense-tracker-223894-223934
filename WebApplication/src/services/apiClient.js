//
// PUBLIC_INTERFACE
/**
 * API client configured via environment variables and feature flags.
 * - Picks base URL from REACT_APP_API_BASE or REACT_APP_BACKEND_URL
 * - Supports mock mode when feature flag "mockApi" is true
 * - Exposes REST methods and mock implementations with same shape
 */
const parseFlags = () => {
  try {
    const raw = process.env.REACT_APP_FEATURE_FLAGS || "{}";
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return {};
  }
};

const FLAGS = parseFlags();

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the computed API base URL from env vars. */
  const primary = process.env.REACT_APP_API_BASE;
  const fallback = process.env.REACT_APP_BACKEND_URL;
  return primary || fallback || "";
}

// Simple fetch wrapper with JSON parsing and error normalization
async function http(method, path, body) {
  const base = getApiBaseUrl();
  const url = `${base}${path}`;
  const headers = {
    "Content-Type": "application/json",
  };
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const error = new Error(data?.message || "Request failed");
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

// Mock data store in-memory
let mockStore = {
  expenses: [
    { id: "1", amount: 25.5, category: "Food", date: "2025-01-01", notes: "Lunch", createdAt: "2025-01-01T12:00:00Z" },
    { id: "2", amount: 120.0, category: "Transport", date: "2025-01-02", notes: "Monthly pass", createdAt: "2025-01-02T08:00:00Z" },
  ],
  categories: ["Food", "Transport", "Groceries", "Utilities", "Entertainment", "Other"],
};

// Utilities
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const genId = () => Math.random().toString(36).slice(2, 10);

// PUBLIC_INTERFACE
export const api = FLAGS.mockApi
  ? {
      /** MOCK: Auth endpoints */
      async login({ email }) {
        await delay(300);
        return { user: { id: "u1", email }, token: "mock-token" };
      },
      async logout() {
        await delay(150);
        return { ok: true };
      },
      async me() {
        await delay(150);
        return { user: { id: "u1", email: "demo@example.com" } };
      },

      /** MOCK: Expense endpoints */
      async listExpenses({ sortBy = "date", order = "desc", category, from, to } = {}) {
        await delay(200);
        let list = [...mockStore.expenses];
        if (category) list = list.filter((e) => e.category === category);
        if (from) list = list.filter((e) => e.date >= from);
        if (to) list = list.filter((e) => e.date <= to);
        list.sort((a, b) => {
          const dir = order === "asc" ? 1 : -1;
          if (sortBy === "amount") return (a.amount - b.amount) * dir;
          return (a.date.localeCompare(b.date)) * dir;
        });
        return { items: list };
      },
      async createExpense(exp) {
        await delay(200);
        const item = { ...exp, id: genId(), createdAt: new Date().toISOString() };
        mockStore.expenses.push(item);
        return item;
      },
      async deleteExpense(id) {
        await delay(150);
        mockStore.expenses = mockStore.expenses.filter((e) => e.id !== id);
        return { ok: true };
      },
      async categories() {
        await delay(100);
        return { items: mockStore.categories };
      },
      async summary({ period = "month" } = {}) {
        await delay(200);
        // naive grouping
        const byCat = {};
        for (const e of mockStore.expenses) {
          byCat[e.category] = (byCat[e.category] || 0) + Number(e.amount || 0);
        }
        const total = Object.values(byCat).reduce((a, b) => a + b, 0);
        return { total, byCategory: byCat, period };
      },
    }
  : {
      /** REST: Auth endpoints */
      async login(payload) {
        return http("POST", "/auth/login", payload);
      },
      async logout() {
        return http("POST", "/auth/logout");
      },
      async me() {
        return http("GET", "/auth/me");
      },

      /** REST: Expenses */
      async listExpenses(params = {}) {
        const query = new URLSearchParams(params).toString();
        return http("GET", `/expenses${query ? `?${query}` : ""}`);
      },
      async createExpense(exp) {
        return http("POST", "/expenses", exp);
      },
      async deleteExpense(id) {
        return http("DELETE", `/expenses/${id}`);
      },
      async categories() {
        return http("GET", "/categories");
      },
      async summary(params = {}) {
        const query = new URLSearchParams(params).toString();
        return http("GET", `/summary${query ? `?${query}` : ""}`);
      },
    };
