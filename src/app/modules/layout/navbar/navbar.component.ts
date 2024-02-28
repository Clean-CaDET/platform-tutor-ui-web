import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
  @Output() themeChanged = new EventEmitter();

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  trim(username: string): string {
    if(username.includes("@")) username = username.split("@")[0];
    if(username.length > 12) username = username.substring(0, 12)+".."
    return username;
  }

  changeTheme(): void {
    this.themeChanged.emit();
  }
}
