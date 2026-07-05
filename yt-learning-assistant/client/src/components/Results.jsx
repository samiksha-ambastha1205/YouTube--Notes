import { useState } from "react";
import Flashcard from "./Flashcard.jsx";
import QuizTab from "./QuizTab.jsx";
import AskTab from "./AskTab.jsx";
import { downloadNotesAsMarkdown, timeToSeconds } from "../utils.js";

const TABS = [
  { key: "summary", label: "Summary" },
  { key: "concepts", label: "Key concepts" },
  { key: "flashcards", label: "Flashcards" },
  { key: "quiz", label: "Quiz" },
  { key: "timestamps", label: "Timestamps" },
  { key: "ask", label: "Ask" },
];

export default function Results({ meta, transcript, material }) {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <section className="results">
      <div className="video-meta">
        <img src={meta.thumbnail} alt="" />
        <div>
          <h3>{meta.title}</h3>
          <p className="mono">{meta.channel}</p>
        </div>
        <button className="btn btn-ghost" onClick={() => downloadNotesAsMarkdown(meta, material)}>
          Download notes ⤓
        </button>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab-btn ${activeTab === t.key ? "active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "summary" && (
        <div className="tab-panel active">
          <p className="short-summary">{material.shortSummary}</p>
          <ul className="bullet-summary">
            {material.bulletSummary.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      )}

      {activeTab === "concepts" && (
        <div className="tab-panel active">
          <div className="concepts-grid">
            {material.keyConcepts.map((c, i) => (
              <div className="concept-item" key={i}>
                <h4>{c.term}</h4>
                <p>{c.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "flashcards" && (
        <div className="tab-panel active">
          <p className="hint">Click a card to flip it.</p>
          <div className="flashcards-grid">
            {material.flashcards.map((f, i) => (
              <Flashcard key={i} front={f.front} back={f.back} />
            ))}
          </div>
        </div>
      )}

      {activeTab === "quiz" && (
        <div className="tab-panel active">
          <QuizTab questions={material.quiz} />
        </div>
      )}

      {activeTab === "timestamps" && (
        <div className="tab-panel active">
          <div className="timestamps-list">
            {material.timestamps.map((t, i) => (
              <a
                key={i}
                className="timestamp-item"
                href={`https://youtu.be/${meta.videoId}?t=${timeToSeconds(t.time)}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="mono">{t.time}</span>
                <span>{t.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {activeTab === "ask" && (
        <div className="tab-panel active">
          <AskTab transcript={transcript} />
        </div>
      )}
    </section>
  );
}
