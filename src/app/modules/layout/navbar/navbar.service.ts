import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  invokeEvent: Subject<any> = new Subject();

  updateContent(task: string): void {
    this.invokeEvent.next(task);
  }
}
