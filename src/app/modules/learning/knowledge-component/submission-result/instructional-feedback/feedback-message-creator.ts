import { Feedback, feedbackTypes } from "../../../model/learning-objects/feedback.model";

export const welcomeMessage = "Zamisli se nad pitanjem i formiraj svoj odgovor.";

export function createResponse(feedback: Feedback): string {
    if(feedback.type === feedbackTypes.pump) return createPump();
    if(feedback.type === feedbackTypes.hint) return createHint(feedback);
    if(feedback.type === feedbackTypes.correctness) return createCorrectness(feedback);
    if(feedback.type === feedbackTypes.solution) return createSolution(feedback);
    return "Došlo je do greške.";
}

function createPump(): string {
    let rnd = getRandomNumber(10);
    if (rnd <= 3) return feedbackStore.pump.think;
    if (rnd <= 6) return feedbackStore.pump.answer;
    if (rnd <= 8) return feedbackStore.pump.read;
    return feedbackStore.pump.instruction;
}

function createHint(feedback: Feedback): string {
    return feedbackStore.hint.basic(feedback.hint);
}

function createCorrectness(feedback: Feedback): string {
    return feedbackStore.correctness.basic(feedback.evaluation.correctnessLevel);
}

function createSolution(feedback: Feedback): string {
    if(feedback.evaluation.correct) {
        let rnd = getRandomNumber(10);
        if (rnd == 1) return feedbackStore.solution.basicCorrect1;
        if (rnd == 2) return feedbackStore.solution.basicCorrect2;
        if (rnd == 3) return feedbackStore.solution.basicCorrect3;
        if (rnd == 4) return feedbackStore.solution.basicCorrect4;
        if (rnd == 5) return feedbackStore.solution.basicCorrect5;
        if (rnd == 6) return feedbackStore.solution.basicCorrect6;
        if (rnd == 7) return feedbackStore.solution.basicCorrect7;
        if (rnd == 8) return feedbackStore.solution.basicCorrect8;
        if (rnd == 9) return feedbackStore.solution.basicCorrect9;
        return feedbackStore.solution.basicCorrect10;
    }
    return feedbackStore.solution.basicIncorrect(feedback.evaluation.correctnessLevel);
}

function getRandomNumber(max: number) {
    return Math.floor(Math.random() * max) + 1;
}

const incorrectAnswer = "🤔 Odgovor nije skroz tačan. ";
const alternative = "\nMožeš i da nastaviš, pa ćeš se vratiti na ovo pitanje.";
// There is a deep structure to this conversation that AutoTutor has already explored. We are creating a basic version for now.
const feedbackStore = {
    pump: {
        think: incorrectAnswer + "Razmisli malo i kreiraj nov odgovor." + alternative,
        answer: incorrectAnswer + "Ako se negde dvoumiš, zamisli se nad dilemom i formiraj nov odgovor." + alternative,
        read: incorrectAnswer + "Da li da ponovo pročitaš tekst pitanja i daš nov odgovor?" + alternative,
        instruction: incorrectAnswer + "Da li ima smisla da ponovo prođeš gradivo?" + alternative
        // A more advanced version would decide when to recommend instruction based on error patterns. We can highlight the appropriate buttons based on feedback response.
    },
    hint: {
        basic: function(hint: string) {
            return incorrectAnswer + "💡Zamisli se nad sledećom smernicom:\n" + hint + alternative;
        }
    },
    correctness: {
        basic: function(correctness: number) {
            return incorrectAnswer + "Tačnost je " + (correctness * 100).toFixed(0) + "%. \n🙂 Hajde da nastavimo, pa se kasnije vraćamo na ovo pitanje.";
        }
    },
    solution: {
        basicCorrect1: "😎 Najs, rešeno.\nIznad je rešenje, al' što se mene tiče možemo odmah da idemo dalje.",
        basicCorrect2: "😊 Odgovor je tačan, sjajno.\nPogledaj iznad ako te interesuje moje obrazloženje odgovora, pa idemo dalje.",
        basicCorrect3: "🤗 Rešeno, svaka čast.\nIznad ću staviti rešenje, pa pročitaj moje teze pre nego što nastavimo.",
        basicCorrect4: "😁 Tačno.\nHajdemo na sledeći izazov!",
        basicCorrect5: "😸 Perrrfektno, tačan odgovor.\nIznad ću ćušnuti rešenje, pa protrči kroz tekst pre nego što skočimo dalje.",
        basicCorrect6: "😀 Sjajno, tačno rešenje!\nIznad sam postavio objašnjenje, pa baci pogled pre nego što nastavimo.",
        basicCorrect7: "😅 Rešeno.\nMožemo da nastavimo kad ti odgovara.",
        basicCorrect8: "😌 Bravo, tačno je!\nEno ga i obrazloženje pa nastavljamo kad ti odgovara.",
        basicCorrect9: "🤓 Super, tačan odgovor!\nProstudiraj povratnu informaciju iznad pre nego što nastavimo.",
        basicCorrect10: "😄 Sjajan rad!\nIdemo dalje!",

        basicIncorrect: function(correctness: number) {
            return incorrectAnswer + "Postignuta tačnost je " + (correctness * 100).toFixed(0) + "%. \nIznad ću diskutovati rešenje pa savetujem da temeljno analiziraš moje teze pre nego što nastavimo.";
        }
    }
};
