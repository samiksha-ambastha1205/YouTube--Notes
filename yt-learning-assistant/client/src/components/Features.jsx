const FEATURES = [
  {
    rotation: "rot-1",
    sticker: "sticker-butter",
    icon: (
      <svg viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="none" stroke="#1B1626" strokeWidth="2.5" />
        <path d="M14 14 L28 20 L14 26 Z" fill="#1B1626" />
      </svg>
    ),
    title: "Summarize",
    text: "Short, bullet, and topic-wise breakdowns of the whole video.",
  },
  {
    rotation: "rot-2",
    sticker: "sticker-coral",
    icon: (
      <svg viewBox="0 0 40 40">
        <rect x="6" y="10" width="22" height="16" rx="3" fill="none" stroke="#1B1626" strokeWidth="2.5" />
        <rect x="12" y="16" width="22" height="16" rx="3" fill="#F3E9D8" stroke="#1B1626" strokeWidth="2.5" />
      </svg>
    ),
    title: "Flashcards",
    text: "Auto-generated revision cards you can flip through.",
  },
  {
    rotation: "rot-3",
    sticker: "sticker-sage",
    icon: (
      <svg viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="none" stroke="#1B1626" strokeWidth="2.5" />
        <path d="M20 11 v10 l7 4" fill="none" stroke="#1B1626" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Quiz yourself",
    text: "Check what actually stuck, right after watching.",
  },
  {
    rotation: "rot-4",
    sticker: "sticker-peri",
    icon: (
      <svg viewBox="0 0 40 40">
        <path d="M8 30 L20 8 L32 30 Z" fill="none" stroke="#1B1626" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M20 18 v7" stroke="#1B1626" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Jump to moments",
    text: "Timestamps that link straight back into the video.",
  },
];

export default function Features() {
  return (
    <section className="features">
      {FEATURES.map((f) => (
        <div key={f.title} className={`feature-card ${f.rotation}`}>
          <div className={`sticker ${f.sticker}`}>{f.icon}</div>
          <h3>{f.title}</h3>
          <p>{f.text}</p>
        </div>
      ))}
    </section>
  );
}
