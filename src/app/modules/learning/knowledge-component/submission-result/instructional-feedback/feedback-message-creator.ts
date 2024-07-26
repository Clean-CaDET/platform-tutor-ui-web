import { Feedback, feedbackTypes } from "../../../model/learning-objects/feedback.model";

export const welcomeMessage = "Zamisli se nad tekstom pitanja i formiraj svoj odgovor.";

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
        if (rnd <= 2) return feedbackStore.solution.basicCorrect1;
        if (rnd <= 4) return feedbackStore.solution.basicCorrect2;
        if (rnd <= 6) return feedbackStore.solution.basicCorrect3;
        if (rnd <= 8) return feedbackStore.solution.basicCorrect4;
        return feedbackStore.solution.basicCorrect5;
    }
    return feedbackStore.solution.basicIncorrect(feedback.evaluation.correctnessLevel);
}

function getRandomNumber(max: number) {
    return Math.floor(Math.random() * max) + 1;
}

const incorrectAnswer = "🤔 Odgovor nije skroz tačan. ";
const alternative = "\nMožeš i da nastaviš, pa ćeš kasnije vratiti na ovu pitanje.";
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
        basicCorrect1: "😎 Najs, rešeno pitanje.\nIznad ću diskutovati rešenje, pa prođi moje teze pre nego što nastavimo dalje.",
        basicCorrect2: "😊 Odgovor je tačan, sjajno.\nIznad ću istaći rešenje, pa analiziraj moje teze pre nego što idemo dalje.",
        basicCorrect3: "🤗 Još jedan rešen, ekstra.\nIznad ću staviti rešenje, pa pročitaj moje teze pre nego što nastavimo.",
        basicCorrect4: "😁 Tačno.\nIznad je rešenje, pa ga istumači ako treba, a onda idemo u nove poduhvate!",
        basicCorrect5: "😸 Odgovor je tačan, super.\nIznad ću postaviti rešenje, pa pogledaj moje teze pre nego što odemo dalje.",
        basicIncorrect: function(correctness: number) {
            return incorrectAnswer + "Postignuta tačnost je " + (correctness * 100).toFixed(0) + "%. \nIznad ću diskutovati rešenje pa savetujem da temeljno analiziraš moje teze pre nego što nastavimo.";
        }
    }
};
