import Hero from "./components/Hero.jsx";
import Features from "./components/Features.jsx";
import AppSection from "./components/AppSection.jsx";

export default function App() {
  return (
    <>
      <Hero />
      <Features />
      <AppSection />
      <footer className="footer">
        <p>made for late-night studying, not for the algorithm.</p>
      </footer>
    </>
  );
}
