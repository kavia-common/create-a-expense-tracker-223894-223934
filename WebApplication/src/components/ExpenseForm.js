import React, { useState } from "react";
import { useApp } from "../context/AppContext";

// PUBLIC_INTERFACE
export default function ExpenseForm({ onCreated }) {
  /** Accessible expense form; validates inputs and posts via context actions. */
  const { state, actions } = useApp();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (Number.isNaN(value) || value <= 0) {
      alert("Amount must be greater than 0");
      return;
    }
    if (!category) {
      alert("Please select a category");
      return;
    }
    const payload = { amount: value, category, date, notes };
    const created = await actions.addExpense(payload);
    if (onCreated) onCreated(created);
    setAmount("");
    setNotes("");
  };

  return (
    <form onSubmit={handleSubmit} aria-labelledby="expense-form-title" style={{ display: "grid", gap: 12 }}>
      <h2 id="expense-form-title">Add Expense</h2>
      <div>
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{ width: "100%", padding: 8 }}
        />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={{ width: "100%", padding: 8 }}
        >
          <option value="">Select category</option>
          {state.categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          name="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          style={{ width: "100%", padding: 8 }}
        />
      </div>
      <div>
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: 8 }}
          placeholder="Optional"
        />
      </div>
      <div>
        <button className="theme-toggle" type="submit">Add</button>
      </div>
    </form>
  );
}
