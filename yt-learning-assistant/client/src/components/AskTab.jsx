import { useState } from "react";

export default function AskTab({ transcript }) {
  const [question, setQuestion] = useState("");
  const [thread, setThread] = useState([]); // [{ role: "q"|"a", text }]

  async function handleSubmit(e) {
    e.preventDefault();
    const q = question.trim();
    if (!q) return;

    setThread((t) => [...t, { role: "q", text: q }]);
    setQuestion("");
    // add a placeholder "thinking..." bubble we'll update once the answer arrives
    setThread((t) => [...t, { role: "a", text: "thinking..." }]);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ transcript, question: q }),
      });
      const data = await res.json();
      const answer = res.ok ? data.answer : data.error;
      setThread((t) => replaceLastAnswer(t, answer));
    } catch {
      setThread((t) => replaceLastAnswer(t, "Couldn't reach the server. Try again."));
    }
  }

  return (
    <div>
      <div className="ask-thread">
        {thread.map((msg, i) => (
          <div key={i} className={`ask-bubble ${msg.role === "q" ? "ask-q" : "ask-a"}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <form className="ask-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Why is this concept important?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Ask</button>
      </form>
    </div>
  );
}

// Swaps the text of the most recent "answer" bubble (the "thinking..." one)
// for the real answer, without touching anything before it.
function replaceLastAnswer(thread, text) {
  const copy = [...thread];
  copy[copy.length - 1] = { role: "a", text };
  return copy;
}
