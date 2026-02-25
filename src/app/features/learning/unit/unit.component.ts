import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoteManagerComponent } from '../notes/note-manager.component';
import { onNavigationEnd } from '../../../core/route.util';

@Component({
  selector: 'cc-unit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, MatSidenavModule, MatIconModule, MatButtonModule, NoteManagerComponent],
  templateUrl: './unit.component.html',
  styleUrl: './unit.component.scss',
})
export class UnitComponent {
  private readonly route = inject(ActivatedRoute);

  readonly sidenavOpened = signal(false);
  readonly unitId = signal(0);
  readonly courseId = signal(0);

  constructor() {
    const params = this.route.snapshot.params;
    this.unitId.set(+params['unitId']);
    this.courseId.set(+params['courseId']);

    onNavigationEnd((_url, p) => {
      if (+p['unitId']) this.unitId.set(+p['unitId']);
      if (+p['courseId']) this.courseId.set(+p['courseId']);
    });
  }
}
