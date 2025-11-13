import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { api } from "../services/apiClient";

/**
 * App-wide state: user session, expenses, categories, feature flags.
 */

const AppContext = createContext(null);

const initialState = {
  user: null,
  expenses: [],
  categories: [],
  loading: false,
  error: null,
  featureFlags: (() => {
    try {
      const raw = process.env.REACT_APP_FEATURE_FLAGS || "{}";
      return typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
      return {};
    }
  })(),
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_EXPENSES":
      return { ...state, expenses: action.payload };
    case "ADD_EXPENSE":
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case "DELETE_EXPENSE":
      return { ...state, expenses: state.expenses.filter((e) => e.id !== action.payload) };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function AppProvider({ children }) {
  /** Provides global state and actions to the app. */
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load session and initial categories
  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const [me, cats] = await Promise.allSettled([api.me(), api.categories()]);
        if (!cancelled) {
          if (me.status === "fulfilled") {
            dispatch({ type: "SET_USER", payload: me.value.user || null });
          }
          if (cats.status === "fulfilled") {
            dispatch({ type: "SET_CATEGORIES", payload: cats.value.items || [] });
          }
        }
      } catch (e) {
        // ignore
      } finally {
        if (!cancelled) dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // Actions
  const actions = useMemo(
    () => ({
      async login(email, password) {
        dispatch({ type: "SET_LOADING", payload: true });
        try {
          const res = await api.login({ email, password });
          dispatch({ type: "SET_USER", payload: res.user });
          return res;
        } catch (e) {
          dispatch({ type: "SET_ERROR", payload: e.message });
          throw e;
        } finally {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      },
      async logout() {
        await api.logout();
        dispatch({ type: "SET_USER", payload: null });
      },
      async loadExpenses(filters = {}) {
        dispatch({ type: "SET_LOADING", payload: true });
        try {
          const res = await api.listExpenses(filters);
          dispatch({ type: "SET_EXPENSES", payload: res.items || [] });
        } catch (e) {
          dispatch({ type: "SET_ERROR", payload: e.message });
        } finally {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      },
      async addExpense(expense) {
        const res = await api.createExpense(expense);
        dispatch({ type: "ADD_EXPENSE", payload: res });
        return res;
      },
      async deleteExpense(id) {
        await api.deleteExpense(id);
        dispatch({ type: "DELETE_EXPENSE", payload: id });
      },
      async refreshCategories() {
        const res = await api.categories();
        dispatch({ type: "SET_CATEGORIES", payload: res.items || [] });
      },
      async getSummary(params) {
        return api.summary(params);
      },
    }),
    []
  );

  const value = useMemo(() => ({ state, actions }), [state, actions]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// PUBLIC_INTERFACE
export function useApp() {
  /** Access global app state and actions. */
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
