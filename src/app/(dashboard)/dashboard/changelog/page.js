import ChangelogClient from "./ChangelogClient";

export default async function ChangelogPage() {
  let content = "";
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/DEYLNN/ai-gateway-next-frontend/main/CHANGELOG.md",
      { next: { revalidate: 300 } } // revalidate every 5 min
    );
    if (res.ok) content = await res.text();
  } catch {}
  return <ChangelogClient content={content} />;
}
