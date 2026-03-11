import Link from "next/link";

export default function ToolCard({ title, link }) {
  return (
    <Link href={link}>
      <div className="tool-card">
        {title}
      </div>
    </Link>
  );
}