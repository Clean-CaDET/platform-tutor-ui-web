import {Component, OnInit} from '@angular/core';
import { TraineeService } from './trainee/service/trainee.service';
import { Trainee } from './trainee/model/trainee.model';

@Component({
  selector: 'cc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  opened = false;
  trainee: Trainee;

  constructor(private traineeService: TraineeService) {
  }

  ngOnInit(): void {
    this.opened = true;
    this.traineeService.trainee$.subscribe(trainee => this.trainee = trainee);
  }

  onLogout(): void {
    this.traineeService.logout();
  }

  toggl(): void {
    this.opened = !this.opened;
  }
}
