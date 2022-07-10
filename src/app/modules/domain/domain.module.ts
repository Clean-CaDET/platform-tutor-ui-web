import {NgModule} from '@angular/core';
import {ArrangeTaskComponent} from './learning-objects/arrange-task/arrange-task.component';
import {ChallengeComponent} from './learning-objects/challenge/challenge.component';
import {ImageComponent} from './learning-objects/image/image.component';
import {QuestionComponent} from './learning-objects/question/question.component';
import {TextComponent} from './learning-objects/text/text.component';
import {VideoComponent} from './learning-objects/video/video.component';
import {LearningObjectDirective} from './learning-objects/learning-object.directive';
import {LearningObjectContainerComponent} from './learning-objects/learning-object-container/learning-object-container.component';
import {BrowserModule} from '@angular/platform-browser';
import {MarkdownModule} from 'ngx-markdown';
import {YouTubePlayerModule} from '@angular/youtube-player';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../infrastructure/material.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NotesModule} from './notes/notes.module';
import {ImageDialogComponent} from './learning-objects/image/image-dialog/image-dialog.component';
import {UnitComponent} from './unit/unit.component';
import {KnowledgeComponentComponent} from './knowledge-component/knowledge-component.component';
import { KnowledgeMapComponent } from './knowledge-map/knowledge-map.component';
import { ShortAnswerQuestionComponent } from './learning-objects/short-answer-question/short-answer-question.component';
import {SubmissionResultComponent} from './submission-result/submission-result.component';
import {EmotionsComponent} from './feedback/emotions/emotions.component';
import {MatDialogModule} from '@angular/material/dialog';
import {TutorImprovementComponent} from './feedback/tutor-improvement/tutor-improvement.component';

@NgModule({
    declarations: [
        ArrangeTaskComponent,
        ChallengeComponent,
        ImageComponent,
        QuestionComponent,
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
        EmotionsComponent,
        TutorImprovementComponent
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
        NotesModule,
        ReactiveFormsModule,
        MatDialogModule
    ],
    exports: [
        LearningObjectContainerComponent,
        SubmissionResultComponent,
        KnowledgeMapComponent,
        EmotionsComponent,
        TutorImprovementComponent
    ]
})
export class DomainModule {
}