import {Injectable} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AeSubmissionService {
  submitAeEvent: Subject<number> = new Subject();
  openEmotionsFormEvent: Subject<void> = new Subject<void>();

  constructor(private snackBar: MatSnackBar) {}

  submit(correctnessLevel: number): void {
    var popupShown = this.tryFeedbackPopup();
    if(!popupShown) {
      this.tryEngagingMessage(correctnessLevel);
    }
    this.submitAeEvent.next(correctnessLevel);
  }

  private tryFeedbackPopup(): boolean {
    let onSubmitClickedCounter = +localStorage.getItem('ON_SUBMIT_CLICKED_COUNTER');
    onSubmitClickedCounter++;
    if (onSubmitClickedCounter >= 5) {
      onSubmitClickedCounter = 0;
      this.openEmotionsFormEvent.next();
    }
    localStorage.setItem('ON_SUBMIT_CLICKED_COUNTER', onSubmitClickedCounter.toString());
    return onSubmitClickedCounter == 0;
  }

  private tryEngagingMessage(correctness: number): boolean {
    const rnd = this.getRandomNumber(10);
    
    switch (true) {
      case (correctness < 0.4):
          if(rnd < 7) return false;

          if(rnd < 9) {
            this.snackBar.open('Hmm, ' + (correctness * 100).toFixed(0) + '% 🤔. Nešto ti nije legao zadatak. Da li ima smisla ponovo da pogledaš gradivo?', 'Ok');
          } else {
            this.snackBar.open('Huh, ' + (correctness * 100).toFixed(0) + '% 😟. Savetujem da se zamisliš nad tvojim i tačnim odgovorima.', 'Ok');
          }
          break;
      case (correctness < 0.9):
          if(rnd < 7) return false;

          if(rnd < 9) {
            this.snackBar.open((correctness * 100).toFixed(0) + '%, not great, not terrible 😐. Analiziraj deo pitanja koji si kiksnuo i zašto.', 'Ok');
          } else {
            this.snackBar.open((correctness * 100).toFixed(0) + '%, ima još posla 😯. Da li ima smisla da ponovo pogledaš gradivo?');
          }
          break;
      default:
          if(rnd < 3) return false;

          if(rnd < 7) {
            this.snackBar.open('Opa, ' + (correctness * 100).toFixed(0) + '% 😄. Ovo je super rezultat, samo napred!', '👌');
          } else {
            this.snackBar.open((correctness * 100).toFixed(0) + '%, strava 😎. Idemo dalje!', '✔️');
          }
          break;
    }
    return true;
  }
  
  private getRandomNumber(max: number) {
    return Math.floor(Math.random() * max) + 1;
  }
}
