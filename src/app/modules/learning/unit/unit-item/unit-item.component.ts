import { Component, Input } from '@angular/core';
import { UnitItem } from '../../model/unit-item.model';

@Component({
  selector: 'cc-unit-item',
  templateUrl: './unit-item.component.html',
  styleUrl: './unit-item.component.scss'
})
export class UnitItemComponent {
  @Input() item: UnitItem;
}
