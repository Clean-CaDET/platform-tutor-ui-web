import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[learningObjectHost]'
})
export class LearningObjectDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
