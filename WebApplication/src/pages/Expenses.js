import React from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";

// PUBLIC_INTERFACE
export default function Expenses() {
  /** Page assembling the expense creation form and the list with filters. */
  return (
    <section aria-labelledby="expenses-page-title" style={{ display: "grid", gap: 24 }}>
      <h1 id="expenses-page-title">Manage Expenses</h1>
      <ExpenseForm />
      <ExpenseList />
    </section>
  );
}
