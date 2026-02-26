export default function FormBox({ children, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="form-box">
      {children}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button type="submit" style={{ flex: 1 }}>Calculate</button>
        <button
          type="button"
          onClick={() => { /* reset logic passed from parent */ }}
          style={{ flex: 1, background: "#f0e68c", color: "#0a2a66" }}
        >
          Reset
        </button>
      </div>
    </form>
  );
}