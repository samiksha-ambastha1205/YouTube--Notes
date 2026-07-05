export default function UrlForm({ url, onUrlChange, onSubmit, error }) {
  return (
    <div className="app-card">
      <h2 className="app-title">Drop the link</h2>
      <form
        className="url-form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input
          type="text"
          placeholder="https://youtube.com/watch?v=..."
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-primary">Get notes</button>
      </form>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}
