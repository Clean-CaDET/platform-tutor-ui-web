import { Component, Input, OnChanges } from '@angular/core';
import { UnitItemService } from './unit-item.service';
import { UnitItem } from './unit-item.model';

@Component({
  selector: 'cc-unit-items',
  templateUrl: './unit-items.component.html',
  styleUrl: './unit-items.component.scss'
})
export class UnitItemsComponent implements OnChanges {
  @Input() unitId: number;
  items: UnitItem[];

  constructor(private service: UnitItemService) {}

  ngOnChanges(): void {
    if(this.unitId) {
      this.service.getUnitItems(this.unitId).subscribe(items => this.items = items);
    }
  }
}
