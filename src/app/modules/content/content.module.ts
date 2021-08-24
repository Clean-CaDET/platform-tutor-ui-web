import { NgModule } from '@angular/core';
import { LectureComponent } from './lecture/lecture.component';
import { KnowledgeNodeComponent } from './knowledge-node/knowledge-node.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ArrangeTaskComponent } from './learning-objects/arrange-task/arrange-task.component';
import { ChallengeComponent } from './learning-objects/challenge/challenge.component';
import { ImageComponent } from './learning-objects/image/image.component';
import { QuestionComponent } from './learning-objects/question/question.component';
import { TextComponent } from './learning-objects/text/text.component';
import { VideoComponent } from './learning-objects/video/video.component';
import { LearningObjectDirective } from './learning-objects/learning-object.directive';
import { LearningObjectContainerComponent } from './learning-objects/learning-object-container/learning-object-container.component';
import { BrowserModule } from '@angular/platform-browser';
import { MarkdownModule } from 'ngx-markdown';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../infrastructure/material.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NotesModule } from '../notes/notes.module';
import { ImageDialogComponent } from './learning-objects/image/image-dialog/image-dialog.component';
import { LearningObjectSummaryComponent } from './learning-object-summary/learning-object-summary.component';



@NgModule({
  declarations: [
    LectureComponent,
    KnowledgeNodeComponent,
    FeedbackComponent,
    ArrangeTaskComponent,
    ChallengeComponent,
    ImageComponent,
    QuestionComponent,
    TextComponent,
    VideoComponent,
    LearningObjectDirective,
    LearningObjectContainerComponent,
    ImageDialogComponent,
    LearningObjectSummaryComponent
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
  ],
  exports: [
    LectureComponent,
    LearningObjectSummaryComponent,
    VideoComponent,
    ImageComponent,
    TextComponent
  ]
})
export class ContentModule { }
