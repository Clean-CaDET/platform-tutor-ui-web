import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { DashboardComponent } from './dashboard/dashboard.component';

@Component({
  selector: 'cc-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DashboardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly user = inject(AuthService).user;
}
