import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'cc-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="padding: 24px;">
      <h1>Home</h1>
      <p>Welcome to Clean CaDET Tutor. Dashboard coming in Phase 2.</p>
    </div>
  `,
})
export class HomeComponent {}
