import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AeService {
  submitAeEvent: Subject<number> = new Subject();
  openEmotionsFormEvent: Subject<void> = new Subject<void>();

  submit(correctnessLevel: number): void {
    let onSubmitClickedCounter = +localStorage.getItem('ON_SUBMIT_CLICKED_COUNTER');
    onSubmitClickedCounter++;
    if (onSubmitClickedCounter >= 5) {
      onSubmitClickedCounter = 0;
      this.openEmotionsFormEvent.next();
    }
    localStorage.setItem('ON_SUBMIT_CLICKED_COUNTER', onSubmitClickedCounter.toString());
    this.submitAeEvent.next(correctnessLevel);
  }
}
