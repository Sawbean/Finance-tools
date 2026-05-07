import Link from "next/link";

export default function ToolCard({ tool }) {
  // Destructure the properties from the tool object
  const { title, cardTitle, link } = tool;

  return (
    <Link href={tool.link}>
      <div className="tool-card" >       
        {/* Use the short cardTitle if available, otherwise the SEO title */}
        {tool.cardTitle || tool.title}
      </div>
    </Link>
  );
}