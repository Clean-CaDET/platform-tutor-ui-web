import { Feedback } from '../../model/feedback.model';

export const welcomeMessage = 'Zamisli se nad pitanjem...';

const pumpMessages: Record<string, string[]> = {
  simpleRetry: [
    'Nije baš to. Razmisli malo i probaj opet.',
  ],
  attentionRedirection: [
    'Odgovor nije tačan. Pažljivo pročitaj tekst pitanja i probaj ponovo.',
    'Nije tačno. Možda je korisno da revidiraš gradivo pre sledećeg pokušaja.',
    'Netačno. Pročitaj pitanje ponovo i obrati pažnju na detalje.',
    'Nije baš to. Ako se negde dvoumiš, zamisli se nad dilemom i formiraj nov odgovor.',
  ],
  deliberationPrompt: [
    'Nije tačno, ali nigde ne žurimo. Razmisli i probaj ponovo.',
    'Nije baš to. Učenje je najbolje kada usporimo, pa razmisli i probaj ponovo.',
    'Netačno. Polako, daj sebi vremena. Razmisli i probaj ponovo.',
    'Odgovor nije tačan. Zastani na trenutak, razmisli, i probaj ponovo.',
  ],
  errorNormalization: [
    'Nije tačno, ali ne sekiraj se. Sve je deo učenja. Probaj ponovo.',
    'Nije baš to, ali sve ok. Greške su deo učenja, pa razmisli i pokušaj ponovo.',
    'Netačno, ali svaka greška je korak ka razumevanju. Probaj ponovo.',
    'Odgovor nije tačan. Ništa strašno. Razmisli i probaj još jednom.',
  ],
};

const categoryWeights = [
  { category: 'simpleRetry', weight: 60 },
  { category: 'attentionRedirection', weight: 15 },
  { category: 'deliberationPrompt', weight: 10 },
  { category: 'errorNormalization', weight: 15 },
];

function getPumpMessage() {
  const roll = Math.random() * 100;
  let cumulative = 0;
  let selected = categoryWeights[0].category;

  for (const { category, weight } of categoryWeights) {
    cumulative += weight;
    if (roll < cumulative) {
      selected = category;
      break;
    }
  }

  const messages = pumpMessages[selected];
  return '🤔 ' + messages[Math.floor(Math.random() * messages.length)];
}

const correctMessages = [
  '😎 Svaka čast! Idemo na sledeći korak.',
  '🤗 Odlično urađeno! Idemo dalje.',
  '😊 Bravo! Tačan odgovor!',
  '😁 Super! Nastavi tako!',
  '😸 Perrrfektno! Hajde skok na sledeći korak.',
  '😀 Izvrsno! Samo napred!',
  '😅 Lepo! Hajde na sledeći izazov.',
  '😌 Sjajno! Znaš ovo!',
  '🤓 Tačno! Lepo se snalaziš!',
  '😄 Bravo! Idemo dalje.',
];

export function createFeedbackMessage(feedback: Feedback): string {
  switch (feedback.type) {
    case 'Pump':
      return getPumpMessage();
    case 'Hint':
      return 'Odgovor nije skroz tačan. 💡Razmisli o sledećem: ' + feedback.hint;
    case 'Correctness':
      return feedback.evaluation
        ? `Tačnost je ${Math.round(feedback.evaluation.correctnessLevel * 100)}%. \n🙂 Hajde da nastavimo, pa se kasnije vraćamo na ovo pitanje.`
        : 'Proveri svoj odgovor.';
    case 'Solution':
      if (feedback.evaluation?.correct) {
        return correctMessages[Math.floor(Math.random() * correctMessages.length)];
      }
      return feedback.evaluation
        ? `Tačnost: ${Math.round(feedback.evaluation.correctnessLevel * 100)}%. Prostudiraj tačan odgovor iznad.`
        : 'Pogledaj tačan odgovor.';
    case 'Error':
      return '🤕 Došlo je do greške. Pokušaj ponovo.';
    default:
      return '';
  }
}
