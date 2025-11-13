import React, { useEffect, useMemo, useState } from "react";
import { useApp } from "../context/AppContext";

// PUBLIC_INTERFACE
export default function ExpenseList() {
  /** List expenses with filters and sorting. */
  const { state, actions } = useApp();
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    actions.loadExpenses({ category: category || undefined, from: from || undefined, to: to || undefined, sortBy, order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, from, to, sortBy, order]);

  const total = useMemo(() => state.expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0), [state.expenses]);

  return (
    <section aria-labelledby="expenses-title" style={{ display: "grid", gap: 16 }}>
      <h1 id="expenses-title">Expenses</h1>
      <div role="region" aria-label="Filters" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {state.categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input aria-label="From date" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input aria-label="To date" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <select aria-label="Sort by" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Date</option>
          <option value="amount">Amount</option>
        </select>
        <select aria-label="Order" value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      <div aria-live="polite" style={{ fontWeight: 600 }}>Total: {total.toFixed(2)}</div>

      <table role="table" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Date</th>
            <th align="left">Category</th>
            <th align="right">Amount</th>
            <th align="left">Notes</th>
            <th align="center" aria-label="Actions"></th>
          </tr>
        </thead>
        <tbody>
          {state.expenses.length === 0 ? (
            <tr><td colSpan="5" style={{ textAlign: "center", padding: 12 }}>No expenses found</td></tr>
          ) : (
            state.expenses.map((e) => (
              <tr key={e.id} style={{ borderTop: "1px solid var(--border-color)" }}>
                <td>{e.date}</td>
                <td>{e.category}</td>
                <td align="right">{Number(e.amount).toFixed(2)}</td>
                <td>{e.notes}</td>
                <td align="center">
                  <button
                    className="theme-toggle"
                    onClick={() => actions.deleteExpense(e.id)}
                    aria-label={`Delete expense ${e.id}`}
                    title="Delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
