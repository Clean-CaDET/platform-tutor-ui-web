import {Component, Input, OnInit} from '@angular/core';
import { User } from 'src/app/infrastructure/auth/user.model';
import {AuthenticationService} from '../../../infrastructure/auth/auth.service';

@Component({
  selector: 'cc-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: User;
  @Input() isDarkTheme: boolean;

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
