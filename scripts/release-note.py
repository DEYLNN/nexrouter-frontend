#!/usr/bin/env python3
"""Append one changelog entry + bump patch version for local FE edits.

Usage:
  python3 scripts/release-note.py "Short summary of current change"
"""
import json
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PKG = ROOT / "package.json"
CHANGELOG = ROOT / "CHANGELOG.md"

summary = " ".join(sys.argv[1:]).strip()
if not summary:
    print('Usage: python3 scripts/release-note.py "Short summary"', file=sys.stderr)
    sys.exit(2)

pkg = json.loads(PKG.read_text())
current = pkg.get("version", "0.0.0")
major, minor, patch = current.split(".")
new_version = f"{major}.{minor}.{int(patch) + 1}"
pkg["version"] = new_version
PKG.write_text(json.dumps(pkg, indent=2) + "\n")

lower = summary.lower()
if any(w in lower for w in ["fix", "bug", "repair", "resolve", "broken", "error"]):
    section = "Fixes"
elif any(w in lower for w in ["add", "new", "create", "implement", "introduce"]):
    section = "Features"
else:
    section = "Improvements"

today = datetime.now().strftime("%Y-%m-%d")
entry = f"## [{new_version}] - {today}\n\n### {section}\n- {summary}\n\n"
existing = CHANGELOG.read_text() if CHANGELOG.exists() else "# Changelog\n"
lines = existing.split("\n", 1)
if len(lines) == 2:
    CHANGELOG.write_text(f"{lines[0]}\n\n{entry}{lines[1].lstrip()}" )
else:
    CHANGELOG.write_text(f"{existing.rstrip()}\n\n{entry}")

print(f"v{current} -> v{new_version}: {summary}")
