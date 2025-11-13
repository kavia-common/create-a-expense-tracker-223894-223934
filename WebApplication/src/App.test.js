import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders navbar links", () => {
  render(<App />);
  expect(screen.getByText(/Expense Tracker/i)).toBeInTheDocument();
  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  expect(screen.getByText(/Expenses/i)).toBeInTheDocument();
  expect(screen.getByText(/Settings/i)).toBeInTheDocument();
});

test("renders auth screen and allows input", async () => {
  render(<App />);
  // navigate to Auth
  expect(screen.getByText(/Auth/i)).toBeInTheDocument();
  screen.getByText(/Auth/i).click();
  const email = await screen.findByTestId("auth-email");
  expect(email).toBeInTheDocument();
});
