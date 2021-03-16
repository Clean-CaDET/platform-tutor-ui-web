import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KnowledgeNodeComponent } from './knowledge-node.component';
import { LearningObjectDirective } from './learning-objects/learning-object.directive';
import { LearningObjectContainerComponent } from './learning-objects/learning-object-container/learning-object-container.component';
import { TextComponent } from './learning-objects/text/text.component';
import { MarkdownModule } from 'ngx-markdown';
import { ImageComponent } from './learning-objects/image/image.component';


@NgModule({
  declarations: [
    KnowledgeNodeComponent,
    LearningObjectDirective,
    LearningObjectContainerComponent,
    TextComponent,
    ImageComponent
  ],
  exports: [
    KnowledgeNodeComponent
  ],
  imports: [
    BrowserModule,
    MarkdownModule.forChild(),
  ]
})
export class KnowledgeNodeModule { }
