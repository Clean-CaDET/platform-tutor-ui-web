import { Directive, ElementRef, OnInit, inject } from '@angular/core';

@Directive({ selector: '[ccAutoFocus]' })
export class AutoFocusDirective implements OnInit {
  private readonly element = inject(ElementRef);

  ngOnInit(): void {
    this.element.nativeElement.focus();
  }
}
