import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'cc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  opened = false;

  ngOnInit(): void {
    this.opened = true;
  }

  toggl(): void {
    this.opened = !this.opened;
  }
}
