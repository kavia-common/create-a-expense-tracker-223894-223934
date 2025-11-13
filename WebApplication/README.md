# Expense Tracker WebApplication

This React app provides the UI for tracking expenses with a minimal, accessible design.

## Core Features Implemented

- Authentication placeholders (login/logout, session awareness)
- Expense entry form (amount, category, date, notes)
- Expense list with filters (category, date range) and sorting (date/amount)
- Summary dashboard (totals by category and period)
- Settings page (theme toggle, env info)
- React Context for state management
- API client with env-based base URL and mock toggle via feature flags

## Environment Configuration

Copy `.env.example` to `.env` and set variables:
- REACT_APP_API_BASE or REACT_APP_BACKEND_URL: Backend base URL
- REACT_APP_FEATURE_FLAGS: JSON string; set `{"mockApi": true}` to use in-browser mock API (default in example)

No secrets are hardcoded. The app reads only values provided through environment variables.

## Scripts

- `npm start` - Start development server
- `npm test` - Run unit tests
- `npm run build` - Build for production

## Notes

- Private routes (Dashboard, Expenses) require a session; use Auth page to sign in (mock by default).
- Accessibility: forms labeled, live regions for totals, keyboard-friendly controls.

