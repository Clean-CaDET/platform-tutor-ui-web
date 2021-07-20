import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LectureComponent } from './lecture.component';
import { KnowledgeNodeComponent } from './knowledge-node/knowledge-node.component';
import { LearningObjectDirective } from './learning-objects/learning-object.directive';
import { LearningObjectContainerComponent } from './learning-objects/learning-object-container/learning-object-container.component';
import { TextComponent } from './learning-objects/text/text.component';
import { MarkdownModule } from 'ngx-markdown';
import { ImageComponent } from './learning-objects/image/image.component';
import { VideoComponent } from './learning-objects/video/video.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { FlexLayoutModule } from '@angular/flex-layout';
import { QuestionComponent } from './learning-objects/question/question.component';
import { MaterialModule } from '../../infrastructure/material.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ArrangeTaskComponent } from './learning-objects/arrange-task/arrange-task.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChallengeComponent } from './learning-objects/challenge/challenge.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { NotesModule } from '../notes/notes.module';

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
    ChallengeComponent,
    FeedbackComponent
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
    DragDropModule,
    NotesModule
  ]
})
export class LectureModule {
}
