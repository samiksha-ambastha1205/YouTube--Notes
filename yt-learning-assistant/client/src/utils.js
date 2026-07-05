export function downloadNotesAsMarkdown(meta, material) {
  const md = `# ${meta.title}

## Summary
${material.shortSummary}

${material.bulletSummary.map((b) => `- ${b}`).join("\n")}

## Key Concepts
${material.keyConcepts.map((c) => `**${c.term}**: ${c.definition}`).join("\n\n")}

## Flashcards
${material.flashcards.map((f) => `Q: ${f.front}\nA: ${f.back}`).join("\n\n")}

## Quiz
${material.quiz
  .map(
    (q, i) =>
      `${i + 1}. ${q.question}\n${q.options
        .map((o, j) => `   ${j === q.answerIndex ? "✓" : "-"} ${o}`)
        .join("\n")}\n   Explanation: ${q.explanation}`
  )
  .join("\n\n")}

## Timestamps
${material.timestamps.map((t) => `- [${t.time}] ${t.label}`).join("\n")}
`;

  const blob = new Blob([md], { type: "text/markdown" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${meta.title.slice(0, 50)}-notes.md`;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function timeToSeconds(mmss) {
  const [m, s] = mmss.split(":").map(Number);
  return (m || 0) * 60 + (s || 0);
}
