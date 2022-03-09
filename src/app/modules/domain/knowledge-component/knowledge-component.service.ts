import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeComponentService {
  submitEvent: Subject<number> = new Subject();
  nextPageEvent: Subject<any> = new Subject<any>();

  submit(correctnessLevel: number): void {
    this.submitEvent.next(correctnessLevel);
  }

  nextPage(page: string): void {
    this.nextPageEvent.next(page);
  }
}
