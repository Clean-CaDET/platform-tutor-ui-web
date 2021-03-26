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
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LectureComponent,
    KnowledgeNodeComponent,
    LearningObjectDirective,
    LearningObjectContainerComponent,
    TextComponent,
    ImageComponent,
    VideoComponent,
    QuestionComponent
  ],
  exports: [
    LectureComponent
  ],
  imports: [
    BrowserModule,
    MarkdownModule.forChild(),
    YouTubePlayerModule,
    FlexLayoutModule,
    MatDividerModule,
    MatButtonModule,
    MatListModule,
    RouterModule,
    FormsModule
  ]
})
export class LectureModule { }
