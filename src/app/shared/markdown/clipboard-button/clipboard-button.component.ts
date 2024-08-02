import { Component } from '@angular/core';

@Component({
  selector: 'cc-clipboard-button',
  templateUrl: './clipboard-button.component.html',
  styleUrl: './clipboard-button.component.scss',
})
export class ClipboardButtonComponent {
  active = false;
  
  onClick() {
    this.active = true;
    setTimeout(() => {
      this.active = false;
    }, 2000)
  }
}
