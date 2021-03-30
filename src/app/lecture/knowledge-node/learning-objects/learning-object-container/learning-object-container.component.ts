import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';
import { LearningObjectDirective } from '../learning-object.directive';
import { LearningObject } from '../model/learning-object.model';
import { LearningObjectComponent } from '../learning-object-component';

@Component({
  selector: 'cc-learning-object-container',
  templateUrl: './learning-object-container.component.html',
  styleUrls: ['./learning-object-container.component.css']
})
export class LearningObjectContainerComponent implements OnInit {

  @Input() learningObject: LearningObject;
  @ViewChild(LearningObjectDirective, {static: true}) learningObjectHost: LearningObjectDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.learningObject.getComponent());
    const componentRef = this.learningObjectHost.viewContainerRef.createComponent<LearningObjectComponent>(componentFactory);
    componentRef.instance.learningObject = this.learningObject;
  }

}
