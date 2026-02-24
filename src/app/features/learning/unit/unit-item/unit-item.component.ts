import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UnitItem, UnitItemType } from '../../model/unit-item.model';

@Component({
  selector: 'cc-unit-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './unit-item.component.html',
  styleUrl: './unit-item.component.scss',
})
export class UnitItemComponent {
  readonly item = input.required<UnitItem>();
  readonly UnitItemType = UnitItemType;
}
