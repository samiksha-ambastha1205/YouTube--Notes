import { useState } from "react";

export default function QuizTab({ questions }) {
  const [index, setIndex] = useState(0);
  const [pickedIndex, setPickedIndex] = useState(null); // null = not answered yet

  const q = questions[index];

  function goTo(nextIndex) {
    setIndex(nextIndex);
    setPickedIndex(null); // reset the answer when changing questions
  }

  return (
    <div className="quiz-question">
      <p className="quiz-progress mono">
        Question {index + 1} / {questions.length}
      </p>
      <h4>{q.question}</h4>

      {q.options.map((option, i) => {
        let cls = "quiz-option";
        if (pickedIndex !== null) {
          if (i === q.answerIndex) cls += " correct";
          else if (i === pickedIndex) cls += " incorrect";
        }
        return (
          <button
            key={i}
            type="button"
            className={cls}
            disabled={pickedIndex !== null}
            onClick={() => setPickedIndex(i)}
          >
            {option}
          </button>
        );
      })}

      {pickedIndex !== null && <p className="quiz-explanation">{q.explanation}</p>}

      <div className="quiz-nav">
        <button
          className="btn btn-ghost"
          disabled={index === 0}
          onClick={() => goTo(index - 1)}
        >
          ← Prev
        </button>
        <button
          className="btn btn-ghost"
          disabled={index === questions.length - 1}
          onClick={() => goTo(index + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
