import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExamplePopupComponent } from '../example-popup/example-popup.component';
import { ClipboardButtonComponent } from 'src/app/shared/markdown/clipboard-button/clipboard-button.component';

@Component({
  selector: 'cc-subactivities',
  templateUrl: './subactivities.component.html',
  styleUrls: ['./subactivities.component.scss']
})
export class SubactivitiesComponent implements OnChanges {
  readonly clipboard = ClipboardButtonComponent;

  @Input() selectedStep: any;
  @Input() order: string;
  @Output() videoStatusChanged = new EventEmitter<any>();
  accumulatedOrder: string;

  constructor(private dialog: MatDialog) { }

  ngOnChanges() {
    this.accumulatedOrder = this.order;
  }

  showExample(event: MouseEvent, subactivity: any) {
    event.stopPropagation();
    let dialogRef = this.dialog.open(ExamplePopupComponent, {
      data: subactivity
    });

    dialogRef.componentInstance.videoStatusChanged.subscribe(data => {
      this.videoStatusChanged.emit(data)
    })
  }
}
