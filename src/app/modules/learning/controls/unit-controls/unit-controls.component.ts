import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cc-unit-controls',
  templateUrl: './unit-controls.component.html',
  styleUrls: ['./unit-controls.component.scss']
})
export class UnitControlsComponent {
  @Input() unitId: number;
  @Input() courseId: number;
  @Input() notesExpanded: boolean;
  @Output() expandNotes = new EventEmitter();
  
  @Input() kcConfig: any;
  @Output() kcViewSwapped = new EventEmitter();
  
  constructor() { }

  openNotes() {
    this.expandNotes.emit(!this.notesExpanded);
  }

  swapKcView(isInstruction: boolean): void {
    if(isInstruction && this.kcConfig.instructionActive) return;
    if(!isInstruction && !this.kcConfig.instructionActive) return;
    if(isInstruction) this.kcViewSwapped.emit("IE");
    else this.kcViewSwapped.emit("AE");
  }
}
