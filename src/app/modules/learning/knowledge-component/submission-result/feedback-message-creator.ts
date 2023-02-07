import { Feedback, feedbackTypes } from "../../model/learning-objects/feedback.model";

export function createResponse(feedback: Feedback, isFirstSatisfaction: boolean): string {
    if(isFirstSatisfaction) return createSatisfied();
    if(feedback.type === feedbackTypes.pump) return createPump();
    if(feedback.type === feedbackTypes.hint) return createHint(feedback);
    if(feedback.type === feedbackTypes.correctness) return createCorrectness(feedback);
    if(feedback.type === feedbackTypes.solution) return createSolution(feedback);
    return "Došlo je do greške.";
}

function createSatisfied(): string {
    return feedbackStore.satisfied.party;
}

function createPump(): string {
    let rnd = getRandomNumber(10);
    if (rnd <= 4) return feedbackStore.pump.answer;
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
        if (rnd <= 6) return feedbackStore.solution.basicCorrect;
        return feedbackStore.solution.catCorrect;
    }
    return feedbackStore.solution.basicIncorrect(feedback.evaluation.correctnessLevel);
}

function getRandomNumber(max: number) {
    return Math.floor(Math.random() * max) + 1;
}

const incorrectAnswer = "Navedeni odgovor nije skroz tačan.\n";
const alternative = "\nAlternativa je da pređeš na sledeći zadatak pa ćeš se kasnije vratiti na ovaj.";
// There is a deep structure to this conversation that AutoTutor has already explored. We are creating a basic version for now.
const feedbackStore = {
    satisfied: {
        party: "Još jedna veština savladana, svaka čast 🥳!\n\nIznad ću prokomentarisati rešenje zadatka pa savetujem da se zamisliš nad tekstom pre nego što se vratiš na lekciju i odabereš sledeću veštinu da razvijaš."
    },
    pump: {
        answer: incorrectAnswer + "Ako se negde dvoumiš, vredi da se zamisliš nad tom dilemom i formiraš nov odgovor." + alternative,
        read: incorrectAnswer + "Da li ima smisla da još jednom pročitaš tekst zadatka i onda formiraš nov odgovor?" + alternative,
        instruction: incorrectAnswer + "Da li ima smisla da još jednom pažljivo prođeš gradivo?" + alternative
        // A more advanced version would decide when to recommend instruction based on error patterns. We can highlight the appropriate buttons based on feedback response.
    },
    hint: {
        basic: function(hint: string) {
            return incorrectAnswer + "Zamisli se nad sledećom smernicom pa vidi da formiraš nov odgovor\n" + hint + alternative;
        }
    },
    correctness: {
        basic: function(correctness: number) {
            return incorrectAnswer + "Postignuta tačnost je " + (correctness * 100).toFixed(0) + "%. Šta misliš, šta je problem sa ovim zadatkom? Gde se nalazi raskorak u tvom razumevanju?\nHajde da pređemo na sledeći zadatak, pa ćemo se kasnije vratiti na ovaj da ga dovršimo.";
        }
    },
    solution: {
        basicCorrect: "Tvoj odgovor na zadatak je tačan, sjajno 😎.\nIznad ću prokomentarisati rešenje pa savetujem da se zamisliš nad tekstom pre nego što pređemo na sledeći zadatak.",
        catCorrect: "Tvoj odgovor na zadatak je tačan, super 😸.\nIznad ću prokomentarisati rešenje pa savetujem da se zamisliš nad tekstom pre nego što pređemo na sledeći zadatak.",
        basicIncorrect: function(correctness: number) {
            return incorrectAnswer + "Postignuta tačnost je " + (correctness * 100).toFixed(0) + "%. Šta misliš, šta je problem sa ovim zadatkom? Gde se nalazi raskorak u tvom razumevanju?\nIznad ću prokomentarisati tačno rešenje pa savetujem da se zamisliš nad tekstom pre nego što pređemo na sledeći zadatak.";
        }
    }
};