import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cc-subactivities',
  templateUrl: './subactivities.component.html',
  styleUrls: ['./subactivities.component.scss']
})
export class SubactivitiesComponent implements OnInit {

  @Input() selectedStep: any;
  @Input() order: string;
  accumulatedOrder: string;

  constructor() { }

  ngOnInit() {
    this.accumulatedOrder = this.order;
  }
}
