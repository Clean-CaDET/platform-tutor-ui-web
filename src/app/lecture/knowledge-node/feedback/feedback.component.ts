import {Component, OnInit, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'cc-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  @Output() submitRating: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onToggle(event): void {
    const rating = parseInt(event.value, 10);
    this.submitRating.emit(rating);
  }

}
