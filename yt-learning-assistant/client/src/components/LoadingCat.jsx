import { useEffect, useState } from "react";

const MESSAGES = [
  "Watching the video so you don't have to...",
  "Skipping the ads for you...",
  "Turning captions into concepts...",
  "Writing flashcards...",
  "Almost there...",
];

export default function LoadingCat() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(timer); // stop the timer once this unmounts
  }, []);

  return (
    <div className="loading">
      <div className="loading-cat">
        <svg viewBox="0 0 100 100" width="90" height="90">
          <ellipse cx="50" cy="60" rx="30" ry="24" fill="#F3E9D8" stroke="#1B1626" strokeWidth="3" />
          <path d="M28 42 L20 22 L38 34 Z" fill="#F3E9D8" stroke="#1B1626" strokeWidth="3" strokeLinejoin="round" />
          <path d="M72 42 L80 22 L62 34 Z" fill="#F3E9D8" stroke="#1B1626" strokeWidth="3" strokeLinejoin="round" />
          <circle cx="40" cy="56" r="3" fill="#1B1626" />
          <circle cx="60" cy="56" r="3" fill="#1B1626" />
          <path d="M42 68 Q50 74 58 68" fill="none" stroke="#1B1626" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <p className="loading-text">{MESSAGES[messageIndex]}</p>
    </div>
  );
}
