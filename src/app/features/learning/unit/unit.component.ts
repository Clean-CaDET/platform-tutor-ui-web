import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'cc-unit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  template: `
    <div style="height: 100%; width: 100%;">
      <router-outlet />
    </div>
  `,
})
export class UnitComponent {}
