import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UnitItem } from '../../model/unit-item.model';

@Component({
  selector: 'cc-unit-item',
  templateUrl: './unit-item.component.html',
  styleUrl: './unit-item.component.scss'
})
export class UnitItemComponent {
  @Input() item: UnitItem;
  @Output() rateItem = new EventEmitter;

  rate() {
    this.rateItem.emit();
  }
}
