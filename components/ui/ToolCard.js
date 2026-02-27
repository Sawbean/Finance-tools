export default function ToolCard({ title, link }) {
  return (
    <div className="tool-card">
      <a href={link}>{title}</a>
    </div>
  );
}