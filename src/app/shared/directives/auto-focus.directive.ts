import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[ccAutoFocus]'
})
export class AutoFocusDirective implements OnInit {
  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.element.nativeElement.focus();
  }
}