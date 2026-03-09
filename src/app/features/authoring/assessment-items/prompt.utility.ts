import { AuthoringAssessmentItem, AuthoringMcq, AuthoringMrq, AuthoringSaq } from './model/assessment-item.model';

export function prepareForPrompt(ai: AuthoringAssessmentItem): string {
  switch (ai.$type) {
    case 'multiChoiceQuestion': return prepareMcq(ai);
    case 'multiResponseQuestion': return prepareMrq(ai);
    case 'shortAnswerQuestion': return prepareSaq(ai);
  }
}

function prepareMcq(ai: AuthoringMcq): string {
  return `
<question>
  <text>
    ${ai.text}
  </text>
  <correctOption>${ai.correctAnswer}</correctOption>
  <distractors>
  ${ai.possibleAnswers
    .filter(a => a !== ai.correctAnswer)
    .map(a => `<distractor>${a}</distractor>`)
    .join('\n')}
  </distractors>
  <feedback>${ai.feedback}</feedback>
</question>
`;
}

function prepareMrq(ai: AuthoringMrq): string {
  return `
<question>
  <text>
    ${ai.text}
  </text>
  <options>
    ${ai.items.map(o => `
    <option>
      <text>${o.text}</text>
      <is-correct>${o.isCorrect}</is-correct>
      <feedback>${o.feedback}</feedback>
    </option>`).join('\n')}
  </options>
</question>
`;
}

function prepareSaq(ai: AuthoringSaq): string {
  return `
<question>
  <text>
    ${ai.text}
  </text>
  <answer>
    ${ai.acceptableAnswers.map(ans => `
    <text>${ans}</text>`).join('\n')}
  </answer>
  <feedback>
    ${ai.feedback}
  </feedback>
</question>
`;
}
