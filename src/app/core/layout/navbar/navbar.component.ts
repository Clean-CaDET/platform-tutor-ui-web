import { Component, ChangeDetectionStrategy, inject, input, output, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../auth/auth.service';
import { LearnerControlsComponent } from './learner-controls/learner-controls.component';
import { InstructorControlsComponent } from './instructor-controls/instructor-controls.component';
import { AdminControlsComponent } from './admin-controls/admin-controls.component';

@Component({
  selector: 'cc-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, MatButtonModule, MatIconModule, MatDividerModule,
    LearnerControlsComponent, InstructorControlsComponent, AdminControlsComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);

  readonly isDarkMode = input.required<boolean>();
  readonly themeToggled = output<void>();

  readonly user = this.authService.user;

  readonly trimmedUsername = computed(() => {
    let name = this.user()?.username ?? '';
    if (name.includes('@')) name = name.split('@')[0];
    if (name.length > 12) name = name.substring(0, 12) + '..';
    return name;
  });

  onLogout(): void {
    this.authService.logout();
  }
}
