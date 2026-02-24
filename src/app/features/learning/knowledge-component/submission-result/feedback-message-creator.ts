import { Feedback } from '../../model/feedback.model';

export const welcomeMessage = 'Zamisli se nad pitanjem...';

const pumpMessages = [
  'Odgovor nije tačan 🤔 Pažljivo pročitaj tekst pitanja i probaj ponovo.',
  'Odgovor nije tačan 🤔 Ako se negde dvoumiš, zamisli se nad dilemom i formiraj nov odgovor.',
  'Odgovor nije tačan 🤔 Nigde ne žurimo. Razmisli i probaj ponovo.',
  'Odgovor nije tačan 🤔 Učenje je najbolje kada usporimo, pa razmisli i probaj ponovo.',
  'Odgovor nije tačan 🤔 Polako. Razmisli i probaj ponovo.',
  'Odgovor nije tačan 🤔 Da li ima smisla da ponovo prođeš gradivo?',
];

const correctMessages = [
  '😎 Svaka čast!',
  '🤗 Odlično urađeno!',
  '😊 Bravo! Tačan odgovor!',
  '😁 Super! Nastavi tako!',
  '😸 Perrrfektno!',
  '😀 Izvrsno! Samo napred!',
  '😅 Fantastično!',
  '😌 Sjajno! Znaš ovo!',
  '🤓 Tačno! Odlično se snalaziš!',
  '😄 Bravo! Svaka čast!',
];

export function createFeedbackMessage(feedback: Feedback): string {
  switch (feedback.type) {
    case 'Pump':
      return pumpMessages[Math.floor(Math.random() * pumpMessages.length)];
    case 'Hint':
      return feedback.hint ?? 'Pogledaj gradivo za pomoć.';
    case 'Correctness':
      return feedback.evaluation
        ? `Tačnost: ${Math.round(feedback.evaluation.correctnessLevel * 100)}%`
        : 'Proveri svoj odgovor.';
    case 'Solution':
      if (feedback.evaluation?.correct) {
        return correctMessages[Math.floor(Math.random() * correctMessages.length)];
      }
      return feedback.evaluation
        ? `Tačnost: ${Math.round(feedback.evaluation.correctnessLevel * 100)}%. Prostudiraj tačan odgovor iznad.`
        : 'Pogledaj tačan odgovor.';
    case 'Error':
      return 'Došlo je do greške. Pokušaj ponovo.';
    default:
      return '';
  }
}
