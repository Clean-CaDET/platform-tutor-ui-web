import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  user: User = null;

  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
