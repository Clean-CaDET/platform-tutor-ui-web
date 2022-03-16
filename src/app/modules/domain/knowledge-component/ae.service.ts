import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AeService {
  submitAeEvent: Subject<number> = new Subject();

  submit(correctnessLevel: number): void {
    this.submitAeEvent.next(correctnessLevel);
  }
}
