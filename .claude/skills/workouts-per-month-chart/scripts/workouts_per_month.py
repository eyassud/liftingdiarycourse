#!/usr/bin/env python3
"""Export a bar chart of workouts per month, read from the DATABASE_URL in .env."""
import argparse
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import psycopg

BAR = "#2a78d6"      # categorical slot 1 (single series)
SURFACE = "#fcfcfb"
TEXT = "#0b0b0b"
MUTED = "#52514e"
GRID = "#f0efec"


def read_database_url(env_path: Path) -> str:
    if not env_path.exists():
        sys.exit(f"Env file not found: {env_path}")
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if line.startswith("DATABASE_URL="):
            return line.split("=", 1)[1].strip().strip("'\"")
    sys.exit(f"DATABASE_URL not found in {env_path}")


def fetch_counts(url: str) -> dict[tuple[int, int], int]:
    sql = """
        SELECT EXTRACT(YEAR FROM started_at AT TIME ZONE 'UTC')::int,
               EXTRACT(MONTH FROM started_at AT TIME ZONE 'UTC')::int,
               COUNT(*)
        FROM workouts
        GROUP BY 1, 2
        ORDER BY 1, 2
    """
    with psycopg.connect(url) as conn, conn.cursor() as cur:
        cur.execute(sql)
        return {(y, m): n for y, m, n in cur.fetchall()}


def month_range(start: tuple[int, int], end: tuple[int, int]):
    y, m = start
    while (y, m) <= end:
        yield (y, m)
        m += 1
        if m > 12:
            y, m = y + 1, 1


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--env", default=".env")
    ap.add_argument("--output", default="workouts-per-month.png")
    args = ap.parse_args()

    counts = fetch_counts(read_database_url(Path(args.env)))
    if not counts:
        sys.exit("No workouts found; nothing to plot.")

    months = list(month_range(min(counts), max(counts)))
    labels = [f"{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m-1]} {y}" for y, m in months]
    values = [counts.get(k, 0) for k in months]

    fig, ax = plt.subplots(figsize=(10, 5.5), dpi=150, facecolor=SURFACE)
    ax.set_facecolor(SURFACE)
    bars = ax.bar(labels, values, color=BAR, width=0.6)
    ax.bar_label(bars, labels=[str(v) if v else "" for v in values], padding=3, color=TEXT, fontsize=10)

    ax.set_title("Workouts per month", loc="left", color=TEXT, fontsize=14, pad=14)
    ax.set_xlabel("Month", color=MUTED)
    ax.set_ylabel("Number of workouts", color=MUTED)
    ax.set_ylim(0, max(values) * 1.15)
    ax.yaxis.get_major_locator().set_params(integer=True)
    ax.set_axisbelow(True)
    ax.yaxis.grid(True, color=GRID, linewidth=1)
    for side in ("top", "right", "left"):
        ax.spines[side].set_visible(False)
    ax.spines["bottom"].set_color(MUTED)
    ax.tick_params(colors=MUTED, length=0)
    plt.setp(ax.get_xticklabels(), rotation=45 if len(labels) > 8 else 0, ha="right" if len(labels) > 8 else "center")

    fig.tight_layout()
    fig.savefig(args.output, facecolor=SURFACE)
    print(f"Saved {args.output}: {sum(values)} workouts across {len(months)} months")


if __name__ == "__main__":
    main()
