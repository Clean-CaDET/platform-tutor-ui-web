import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { MarkdownModule } from 'ngx-markdown';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { CourseComponent } from './course/course.component';
import { InstructorCourseComponent } from '../group-monitoring/instructor-course/instructor-course.component';
import { LearnerCourseComponent } from './course/learner-course/learner-course.component';
import { KnowledgeComponentComponent } from './knowledge-component/knowledge-component.component';
import { KnowledgeMapComponent } from './unit/knowledge-map/knowledge-map.component';
import { ArrangeTaskComponent } from './knowledge-component/learning-objects/arrange-task/arrange-task.component';
import { ChallengeComponent } from './knowledge-component/learning-objects/challenge/challenge.component';
import { ImageDialogComponent } from './knowledge-component/learning-objects/image/image-dialog/image-dialog.component';
import { ImageComponent } from './knowledge-component/learning-objects/image/image.component';
import { LearningObjectContainerComponent } from './knowledge-component/learning-objects/learning-object-container/learning-object-container.component';
import { LearningObjectDirective } from './knowledge-component/learning-objects/learning-object.directive';
import { MultipleChoiceQuestionComponent } from './knowledge-component/learning-objects/multiple-choice-question/multiple-choice-question.component';
import { MultipleResponseQuestionComponent } from './knowledge-component/learning-objects/multiple-response-question/multiple-response-question.component';
import { ShortAnswerQuestionComponent } from './knowledge-component/learning-objects/short-answer-question/short-answer-question.component';
import { TextComponent } from './knowledge-component/learning-objects/text/text.component';
import { VideoComponent } from './knowledge-component/learning-objects/video/video.component';
import { SubmissionResultComponent } from './knowledge-component/submission-result/submission-result.component';
import { UnitComponent } from './unit/unit.component';
import { MatIconModule } from '@angular/material/icon';
import { LearningUtilitiesModule } from '../learning-utilities/learning-utilities.module';
import { TutorImprovementComponent } from './unit/tutor-improvement/tutor-improvement.component';

@NgModule({
  declarations: [
    ArrangeTaskComponent,
    ChallengeComponent,
    ImageComponent,
    MultipleResponseQuestionComponent,
    TextComponent,
    VideoComponent,
    LearningObjectDirective,
    LearningObjectContainerComponent,
    ImageDialogComponent,
    UnitComponent,
    KnowledgeComponentComponent,
    KnowledgeMapComponent,
    ShortAnswerQuestionComponent,
    SubmissionResultComponent,
    MultipleChoiceQuestionComponent,
    CourseComponent,
    InstructorCourseComponent,
    LearnerCourseComponent,
    TutorImprovementComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    MarkdownModule.forChild(),
    YouTubePlayerModule,
    FlexLayoutModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    DragDropModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    LearningUtilitiesModule,
  ],
  exports: [
    LearningObjectContainerComponent,
    SubmissionResultComponent,
    KnowledgeMapComponent,
    TutorImprovementComponent,
    InstructorCourseComponent,
    LearnerCourseComponent,
  ],
})
export class LearningModule {}
