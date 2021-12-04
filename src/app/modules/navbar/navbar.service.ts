import {Injectable} from '@angular/core';
import {Unit} from '../content/unit/model/unit.model';
import {BehaviorSubject, Subject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private unit = new BehaviorSubject<Unit>(new Unit());
  currentUnit = this.unit.asObservable();

  constructor() {

  }

  setUnit(unit: Unit): void {
    this.unit.next(unit);
  }

  setKnowledgeComponent(): void {

  }
}
