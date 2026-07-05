import { useState } from "react";

export default function Flashcard({ front, back }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flashcard ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped((f) => !f)}
    >
      <div className="flashcard-inner">
        <div className="flashcard-face flashcard-front">{front}</div>
        <div className="flashcard-face flashcard-back">{back}</div>
      </div>
    </div>
  );
}
