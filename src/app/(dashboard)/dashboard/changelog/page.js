import { readFileSync } from "fs";
import { join } from "path";
import ChangelogClient from "./ChangelogClient";

export default function ChangelogPage() {
  let content = "";
  try {
    content = readFileSync(join(process.cwd(), "CHANGELOG.md"), "utf-8");
  } catch {}
  return <ChangelogClient content={content} />;
}
