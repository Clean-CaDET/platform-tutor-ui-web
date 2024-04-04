import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExamplePopupComponent } from '../example-popup/example-popup.component';

@Component({
  selector: 'cc-subactivities',
  templateUrl: './subactivities.component.html',
  styleUrls: ['./subactivities.component.scss']
})
export class SubactivitiesComponent implements OnInit {

  @Input() selectedStep: any;
  @Input() order: string;
  accumulatedOrder: string;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.accumulatedOrder = this.order;
  }

  showExample(event: MouseEvent, subactivity: any) {
    event.stopPropagation();
    this.dialog.open(ExamplePopupComponent, {
      data: subactivity
    });
  }
}
