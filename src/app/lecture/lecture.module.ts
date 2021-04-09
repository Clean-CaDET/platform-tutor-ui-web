import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LectureComponent } from './lecture.component';
import { KnowledgeNodeComponent } from './knowledge-node/knowledge-node.component';
import { LearningObjectDirective } from './knowledge-node/learning-objects/learning-object.directive';
import { LearningObjectContainerComponent } from './knowledge-node/learning-objects/learning-object-container/learning-object-container.component';
import { TextComponent } from './knowledge-node/learning-objects/text/text.component';
import { MarkdownModule } from 'ngx-markdown';
import { ImageComponent } from './knowledge-node/learning-objects/image/image.component';
import { VideoComponent } from './knowledge-node/learning-objects/video/video.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { FlexLayoutModule } from '@angular/flex-layout';
import { QuestionComponent } from './knowledge-node/learning-objects/question/question.component';
import { MaterialModule } from '../infrastructure/material.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArrangeTaskComponent } from './knowledge-node/learning-objects/arrange-task/arrange-task.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChallengeComponent } from './knowledge-node/learning-objects/challenge/challenge.component';


@NgModule({
  declarations: [
    LectureComponent,
    KnowledgeNodeComponent,
    LearningObjectDirective,
    LearningObjectContainerComponent,
    TextComponent,
    ImageComponent,
    VideoComponent,
    QuestionComponent,
    ArrangeTaskComponent,
    ChallengeComponent
  ],
  exports: [
    LectureComponent
  ],
  imports: [
    BrowserModule,
    MarkdownModule.forChild(),
    YouTubePlayerModule,
    FlexLayoutModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    DragDropModule
  ]
})
export class LectureModule { }
