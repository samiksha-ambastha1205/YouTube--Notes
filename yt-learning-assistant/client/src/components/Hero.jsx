export default function Hero() {
  return (
    <header className="hero">
      <nav className="nav">
        <span className="wordmark">
          Reel<span className="wordmark-dot">→</span>Notes
        </span>
        <a className="nav-link" href="#app">Try it</a>
      </nav>

      <div className="hero-inner">
        <p className="eyebrow">paste a link. get a whole study kit.</p>
        <h1 className="hero-title">
          Long lectures,
          <br />
          <span className="squiggle-wrap">
            shrunk
            <svg className="squiggle" viewBox="0 0 300 20" preserveAspectRatio="none">
              <path
                d="M0 12 Q 20 2, 40 12 T 80 12 T 120 12 T 160 12 T 200 12 T 240 12 T 280 12 T 300 12"
                fill="none"
                stroke="#E8604C"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <br />
          into notes you'll
          <br />
          actually remember.
        </h1>
        <p className="hero-sub">
          Drop a YouTube URL. Get a summary, flashcards, a quiz, and clickable
          timestamps — no sign-up, no clutter.
        </p>
        <a href="#app" className="btn btn-primary">Paste a link ↓</a>
      </div>

      <svg className="wave-divider" viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path
          d="M0,40 C 240,90 480,0 720,40 C 960,80 1200,10 1440,50 L1440,90 L0,90 Z"
          fill="#F3E9D8"
        />
      </svg>
    </header>
  );
}
