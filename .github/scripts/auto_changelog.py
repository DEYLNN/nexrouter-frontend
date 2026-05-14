#!/usr/bin/env python3
"""Auto-update CHANGELOG.md and bump package.json version from git commits."""
import subprocess, json, re, sys
from datetime import datetime
from pathlib import Path

def get_commits_since_last_tag():
    """Get commits since last version tag."""
    try:
        last_tag = subprocess.check_output(
            ["git", "describe", "--tags", "--abbrev=0"], text=True, stderr=subprocess.DEVNULL
        ).strip()
        commits = subprocess.check_output(
            ["git", "log", f"{last_tag}..HEAD", "--oneline", "--no-merges"], text=True
        ).strip()
    except subprocess.CalledProcessError:
        # No tags yet — get all commits
        commits = subprocess.check_output(
            ["git", "log", "--oneline", "--no-merges", "-50"], text=True
        ).strip()
    return commits.split("\n") if commits else []

def categorize_commit(msg):
    """Categorize commit message into Features/Fixes/Improvements."""
    msg_lower = msg.lower()
    if any(w in msg_lower for w in ["add", "new", "feat", "create", "implement", "introduce"]):
        return "Features"
    elif any(w in msg_lower for w in ["fix", "bugfix", "patch", "resolve", "repair"]):
        return "Fixes"
    elif any(w in msg_lower for w in ["update", "improve", "refactor", "optimize", "enhance", "bump", "sync", "clean"]):
        return "Improvements"
    else:
        return "Improvements"

def main():
    repo_root = Path.cwd()
    pkg_path = repo_root / "package.json"
    changelog_path = repo_root / "CHANGELOG.md"
    
    # Get current version
    pkg = json.loads(pkg_path.read_text())
    current = pkg["version"]
    
    # Bump minor
    major, minor, patch = current.split(".")
    new_version = f"{major}.{int(minor) + 1}.0"
    
    # Get commits
    commits = get_commits_since_last_tag()
    if not commits:
        print("No new commits found")
        return
    
    # Categorize
    sections = {"Features": [], "Fixes": [], "Improvements": []}
    skip = ["Merge", "merge", "chore:", "WIP", "wip", "tmp", "debug"]
    for c in commits:
        _, _, msg = c.partition(" ")
        if any(s in msg for s in skip):
            continue
        cat = categorize_commit(msg)
        sections[cat].append(msg)
    
    # Generate entry
    today = datetime.now().strftime("%Y-%m-%d")
    entry = f"## [{new_version}] - {today}\n\n"
    for section_name in ["Features", "Fixes", "Improvements"]:
        items = sections[section_name]
        if items:
            entry += f"### {section_name}\n"
            for item in items:
                entry += f"- {item}\n"
            entry += "\n"
    
    # Update CHANGELOG.md
    existing = changelog_path.read_text() if changelog_path.exists() else "# Changelog\n\n"
    # Insert after first line
    lines = existing.split("\n", 1)
    if len(lines) > 1:
        new_content = f"{lines[0]}\n\n{entry}{lines[1]}"
    else:
        new_content = f"{lines[0]}\n\n{entry}"
    changelog_path.write_text(new_content)
    
    # Bump version
    pkg["version"] = new_version
    pkg_path.write_text(json.dumps(pkg, indent=2) + "\n")
    
    print(f"v{current} → v{new_version} ({len(commits)} commits)")

if __name__ == "__main__":
    main()
