import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/infrastructure/material.module';
import { CourseStructureComponent } from './course-structure/course-structure.component';
import { CourseDetailsComponent } from './course-structure/course-details/course-details.component';
import { UnitDetailsComponent } from './course-structure/unit-details/unit-details.component';
import { KcTreeComponent } from './knowledge-component/kc-tree/kc-tree.component';
import { TutorMarkdownModule } from 'src/app/shared/markdown/markdown.module';
import { InstructionalItemsComponent } from './knowledge-component/instructional-items/instructional-items.component';
import { RouterModule } from '@angular/router';
import { KnowledgeComponentAuthoringComponent } from './knowledge-component/knowledge-component-authoring.component';
import { KcFormComponent } from './knowledge-component/kc-form/kc-form.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { VideoAuthoringComponent } from './knowledge-component/instructional-items/video-authoring/video-authoring.component';
import { AssessmentItemsComponent } from './assessment-items/assessment-items.component';
import { MarkdownModule } from 'ngx-markdown';
import { MrqFormComponent } from './assessment-items/mrq-form/mrq-form.component';
import { McqFormComponent } from './assessment-items/mcq-form/mcq-form.component';
import { SaqFormComponent } from './assessment-items/saq-form/saq-form.component';
import {LearningModule} from "../learning/learning.module";
import { ActivitiesComponent } from './activities/activities.component';
import { ActivityTreeComponent } from './activities/activity-tree/activity-tree.component';
import { ActivityDetailsComponent } from './activities/activity-details/activity-details.component';
import { LearningTasksComponent } from './learning-tasks/learning-tasks.component';
import { LearningTaskTreeComponent } from './learning-tasks/learning-task-tree/learning-task-tree.component';
import { LearningTaskFormComponent } from './learning-tasks/learning-task-form/learning-task-form.component';
import { StepFormComponent } from './learning-tasks/step-form/step-form.component';
import { DomainModelComponent } from './learning-tasks/domain-model/domain-model.component';

@NgModule({
  declarations: [
    CourseStructureComponent,
    CourseDetailsComponent,
    UnitDetailsComponent,
    KcTreeComponent,
    KcFormComponent,
    InstructionalItemsComponent,
    KnowledgeComponentAuthoringComponent,
    VideoAuthoringComponent,
    AssessmentItemsComponent,
    MrqFormComponent,
    McqFormComponent,
    SaqFormComponent,
    ActivitiesComponent,
    ActivityTreeComponent,
    ActivityDetailsComponent,
    LearningTasksComponent,
    LearningTaskTreeComponent,
    LearningTaskFormComponent,
    StepFormComponent,
    DomainModelComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    TutorMarkdownModule,
    LearningModule,
    YouTubePlayerModule,
    MarkdownModule
  ]
})
export class AuthoringModule { }
