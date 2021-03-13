import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KnowledgeNodeComponent } from './knowledge-node.component';
import { LearningObjectDirective } from './learning-objects/learning-object.directive';
import { LearningObjectContainerComponent } from './learning-objects/learning-object-container/learning-object-container.component';


@NgModule({
  declarations: [
    KnowledgeNodeComponent,
    LearningObjectDirective,
    LearningObjectContainerComponent
  ],
  exports: [
    KnowledgeNodeComponent
  ],
  imports: [
    BrowserModule
  ]
})
export class KnowledgeNodeModule { }
