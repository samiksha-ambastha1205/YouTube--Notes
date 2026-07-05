import { useState } from "react";
import UrlForm from "./UrlForm.jsx";
import LoadingCat from "./LoadingCat.jsx";
import Results from "./Results.jsx";

const API = import.meta.env.VITE_API_URL;

export default function AppSection() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error | ready
  const [error, setError] = useState("");
  const [data, setData] = useState(null); // { meta, transcript, material }

  async function handleSubmit() {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(`${API}/analyze`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Something went wrong.");
      setData(result);
      setStatus("ready");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <main id="app" className="app">
      <UrlForm
        url={url}
        onUrlChange={setUrl}
        onSubmit={handleSubmit}
        error={status === "error" ? error : ""}
      />
      {status === "loading" && <LoadingCat />}
      {status === "ready" && data && (
        <Results meta={data.meta} transcript={data.transcript} material={data.material} />
      )}
    </main>
  );
}
