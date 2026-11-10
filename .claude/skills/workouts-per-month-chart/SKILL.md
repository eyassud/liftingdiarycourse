---
name: workouts-per-month-chart
description: Query the database for all workout entries and export a bar chart image (PNG) of the number of workouts per month. Use when the user asks for a workouts-per-month chart, workout frequency graph, or a plot/export of workout counts.
---

# Workouts per month chart

Queries the `workouts` table using `DATABASE_URL` from the project's `.env`, counts workouts per month (by `started_at`), and saves a bar chart (x = month, y = number of workouts) as a PNG.

## Steps

1. One-time setup (skip if `.claude/skills/workouts-per-month-chart/.venv` exists):
   ```bash
   python3 -m venv .claude/skills/workouts-per-month-chart/.venv
   .claude/skills/workouts-per-month-chart/.venv/bin/pip install -r .claude/skills/workouts-per-month-chart/scripts/requirements.txt
   ```
2. Run the script from the project root:
   ```bash
   .claude/skills/workouts-per-month-chart/.venv/bin/python .claude/skills/workouts-per-month-chart/scripts/workouts_per_month.py
   ```
   Optional: `--output <path.png>` (default `workouts-per-month.png` in the project root), `--env <path>` (default `.env`).
3. Tell the user the output path and the totals the script prints. View the PNG with Read to check it renders sensibly.

## Notes

- Counts **all** workouts across all users (it's an admin-style report, not a user-facing feature). Mention this if the data may contain multiple users.
- Months with zero workouts between the first and last workout are shown as empty bars so the x-axis is continuous.
- The script is read-only (a single `SELECT`). It never prints the connection string.
- This is a standalone Python script, so the app's "Drizzle only / `/data` directory" rules in `docs/data-fetching.md` do not apply; do not copy this query into the Next.js app.
- If the script reports no workouts, don't generate an empty chart; tell the user.
