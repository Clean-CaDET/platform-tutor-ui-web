import { AssessmentItem } from './model/assessment-item.model';
import { MultipleChoiceQuestion } from './model/mcq.model';
import { MultipleReponseQuestion } from './model/mrq.model';
import { ShortAnswerQuestion } from './model/saq.model';

export function prepareForPrompt(ai: AssessmentItem): string {
  switch(ai.$type) {
    case 'multiChoiceQuestion': return prepareMcq(ai as MultipleChoiceQuestion);
    case 'multiResponseQuestion': return prepareMrq(ai as MultipleReponseQuestion);
    case 'shortAnswerQuestion': return prepareSaq(ai as ShortAnswerQuestion);
  }
  return "";
}

function prepareMcq(ai: MultipleChoiceQuestion): string {
  return `
<question>
  <text>
    ${ai.text}
  </text>
  <correctOption>${ai.correctAnswer}</correctOption>
  <distractors>
  ${ai.possibleAnswers
    .filter(a => a !== ai.correctAnswer)
    .map((a) => `<distractor>${a}</distractor>`)
    .join('\n')}
  </distractors>
  <feedback>${ai.feedback}</feedback>
</question>
`;
}

function prepareMrq(ai: MultipleReponseQuestion): string {
  return `
<question>
  <text>
    ${ai.text}
  </text>
  <options>
    ${ai.items.map((o) => `
    <option>
      <text>${o.text}</text>
      <is-correct>${o.isCorrect}</is-correct>
      <feedback>${o.feedback}</feedback>
    </option>`
      ).join('\n')}
  </options>
</question>
`;
}

function prepareSaq(ai: ShortAnswerQuestion): string {
  return `
<question>
  <text>
    ${ai.text}
  </text>
  <answer>
    ${ai.acceptableAnswers
      .map((ans) => `
    <text>${ans}</text>`)
      .join('\n')}
  </answer>
  <feedback>
    ${ai.feedback}
  </feedback>
</question>
`;
}