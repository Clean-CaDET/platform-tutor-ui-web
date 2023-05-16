import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { MarkdownModule } from 'ngx-markdown';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { CourseComponent } from './course/course.component';
import { CourseUnitsComponent } from './course/course-units/course-units.component';
import { KnowledgeComponentComponent } from './knowledge-component/knowledge-component.component';
import { KnowledgeMapComponent } from './unit/knowledge-map/knowledge-map.component';
import { LearningObjectContainerComponent } from './knowledge-component/learning-objects/learning-object-container/learning-object-container.component';
import { LearningObjectDirective } from './knowledge-component/learning-objects/learning-object.directive';
import { TextComponent } from './knowledge-component/learning-objects/instructional-items/text/text.component';
import { VideoComponent } from './knowledge-component/learning-objects/instructional-items/video/video.component';
import { SubmissionResultComponent } from './knowledge-component/submission-result/submission-result.component';
import { UnitComponent } from './unit/unit.component';
import { LearningUtilitiesModule } from '../learning-utilities/learning-utilities.module';
import { TutorImprovementComponent } from './unit/tutor-improvement/tutor-improvement.component';
import { ArrangeTaskComponent } from './knowledge-component/learning-objects/assessment-items/arrange-task/arrange-task.component';
import { ImageComponent } from './knowledge-component/learning-objects/instructional-items/image/image.component';
import { MultipleResponseQuestionComponent } from './knowledge-component/learning-objects/assessment-items/multiple-response-question/multiple-response-question.component';
import { ImageDialogComponent } from './knowledge-component/learning-objects/instructional-items/image/image-dialog/image-dialog.component';
import { ShortAnswerQuestionComponent } from './knowledge-component/learning-objects/assessment-items/short-answer-question/short-answer-question.component';
import { MultipleChoiceQuestionComponent } from './knowledge-component/learning-objects/assessment-items/multiple-choice-question/multiple-choice-question.component';
import { LearningObserverComponent } from './learning-observer/learning-observer.component';
import { TypingAnimatorDirective } from './knowledge-component/submission-result/instructional-feedback/typing-animation.directive';
import { KcRateComponent } from './knowledge-component/kc-rate/kc-rate.component';
import {StarRatingModule} from "angular-star-rating";
import {MatChipsModule} from "@angular/material/chips";

@NgModule({
  declarations: [
    ArrangeTaskComponent,
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
    CourseUnitsComponent,
    TutorImprovementComponent,
    LearningObserverComponent,
    TypingAnimatorDirective,
    KcRateComponent
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
        LearningUtilitiesModule,
        StarRatingModule.forRoot()
    ],
  exports: [
    LearningObjectContainerComponent,
    SubmissionResultComponent,
    KnowledgeMapComponent,
    TutorImprovementComponent,
  ],
})
export class LearningModule {}
