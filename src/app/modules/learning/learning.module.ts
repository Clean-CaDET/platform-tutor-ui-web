import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { MarkdownModule } from 'ngx-markdown';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { CourseComponent } from './course/course.component';
import { CourseUnitsComponent } from './course/course-units/course-units.component';
import { KnowledgeComponentComponent } from './knowledge-component/knowledge-component.component';
import { LearningObjectContainerComponent } from './knowledge-component/learning-objects/learning-object-container/learning-object-container.component';
import { LearningObjectDirective } from './knowledge-component/learning-objects/learning-object.directive';
import { TextComponent } from './knowledge-component/learning-objects/instructional-items/text/text.component';
import { VideoComponent } from './knowledge-component/learning-objects/instructional-items/video/video.component';
import { SubmissionResultComponent } from './knowledge-component/submission-result/submission-result.component';
import { UnitComponent } from './unit/unit.component';
import { LearningUtilitiesModule } from '../learning-utilities/learning-utilities.module';
import { ImageComponent } from './knowledge-component/learning-objects/instructional-items/image/image.component';
import { MultipleResponseQuestionComponent } from './knowledge-component/learning-objects/assessment-items/multiple-response-question/multiple-response-question.component';
import { ImageDialogComponent } from './knowledge-component/learning-objects/instructional-items/image/image-dialog/image-dialog.component';
import { ShortAnswerQuestionComponent } from './knowledge-component/learning-objects/assessment-items/short-answer-question/short-answer-question.component';
import { MultipleChoiceQuestionComponent } from './knowledge-component/learning-objects/assessment-items/multiple-choice-question/multiple-choice-question.component';
import { TypingAnimatorDirective } from './knowledge-component/submission-result/instructional-feedback/typing-animation.directive';
import { UnitProgressRatingComponent } from './unit/unit-progress-rating/unit-progress-rating.component';
import { StarRatingModule } from "angular-star-rating";
import { TaskComponent } from './task/task.component';
import { SubactivitiesComponent } from './task/subactivities/subactivities.component';
import { ExamplePopupComponent } from './task/example-popup/example-popup.component';
import { UnitDetailsComponent } from './unit/unit-details/unit-details.component';
import { UnitItemComponent } from "./unit/unit-item/unit-item.component";
import { AssessmentItemListComponent } from './knowledge-component/assessment-item-list/assessment-item-list.component';
import { TutorMarkdownModule } from 'src/app/shared/markdown/markdown.module';
import { ReflectionComponent } from './reflection/reflection.component';

@NgModule({
  declarations: [
    ImageComponent,
    MultipleResponseQuestionComponent,
    TextComponent,
    VideoComponent,
    LearningObjectDirective,
    LearningObjectContainerComponent,
    ImageDialogComponent,
    UnitComponent,
    KnowledgeComponentComponent,
    ShortAnswerQuestionComponent,
    SubmissionResultComponent,
    MultipleChoiceQuestionComponent,
    CourseComponent,
    CourseUnitsComponent,
    TypingAnimatorDirective,
    UnitProgressRatingComponent,
    TaskComponent,
    SubactivitiesComponent,
    ExamplePopupComponent,
    UnitDetailsComponent,
    UnitItemComponent,
    AssessmentItemListComponent,
    ReflectionComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MarkdownModule.forChild(),
    YouTubePlayerModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    LearningUtilitiesModule,
    StarRatingModule.forRoot(),
    TutorMarkdownModule
],
  exports: [
    LearningObjectContainerComponent,
    SubmissionResultComponent
  ],
})
export class LearningModule { }
