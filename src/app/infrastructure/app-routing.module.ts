import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../modules/layout/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { UnitComponent } from '../modules/learning/unit/unit.component';
import { KnowledgeComponentComponent } from '../modules/learning/knowledge-component/knowledge-component.component';
import { CourseComponent } from '../modules/learning/course/course.component';
import { GroupMonitoringComponent } from '../modules/monitoring/group-monitoring/group-monitoring.component';
import { LearnersComponent } from '../modules/management/stakeholders/learners/learners.component';
import { InstructorsComponent } from '../modules/management/stakeholders/instructors/instructors.component';
import { CoursesComponent } from '../modules/management/courses/courses.component';
import { CourseStructureComponent } from '../modules/authoring/course-structure/course-structure.component';
import { InstructionalItemsComponent } from '../modules/authoring/knowledge-component/instructional-items/instructional-items.component';
import { KnowledgeComponentAuthoringComponent } from '../modules/authoring/knowledge-component/knowledge-component-authoring.component';
import { AssessmentItemsComponent } from '../modules/authoring/assessment-items/assessment-items.component';
import { UnitAnalyticsComponent } from '../modules/knowledge-analytics/unit-analytics/unit-analytics.component';
import { LearningTaskComponent } from '../modules/authoring/learning-tasks/learning-task/learning-task.component';
import { TaskComponent } from '../modules/learning/task/task.component';
import { UnitDetailsComponent } from '../modules/learning/unit/unit-details/unit-details.component';
import { ConfirmExitGuard } from './confirm-leave.guard';
import { CourseMonitoringComponent } from '../modules/monitoring/course-monitoring/course-monitoring.component';
import { ReflectionComponent } from '../modules/learning/reflection/reflection.component';

// Generic titles are defined here. Title service is used in components for data-based titles.
const routes: Routes = [
  { path: 'login', title: 'Clean CaDET Tutor', component: LoginComponent },
  {
    path: 'home',
    title: 'Clean CaDET Tutor',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { role: ['learner', 'learnercommercial', 'instructor', 'administrator'] }
  },
  {
    path: 'courses/:courseId',
    component: CourseComponent,
    canActivate: [AuthGuard],
    data: { role: ['learner', 'learnercommercial'] }
  },
  {
    path: 'courses/:courseId/units/:unitId',
    component: UnitComponent,
    canActivate: [AuthGuard],
    data: { role: ['learner', 'learnercommercial'] },
    children: [
      {
        path: '',
        component: UnitDetailsComponent
      },
      {
        path: 'kcs/:kcId',
        component: KnowledgeComponentComponent
      },
      {
        path: 'tasks/:ltId',
        component: TaskComponent
      },
      {
        path: 'reflections/:rId',
        component: ReflectionComponent
      }
    ]
  },

  
  {
    path: 'analytics/:courseId/statistics',
    title: 'Tutor - Analitike',
    component: UnitAnalyticsComponent,
    canActivate: [AuthGuard],
    data: { role: ['instructor'] },
  },
  {
    path: 'monitoring/:courseId/:mode',
    component: GroupMonitoringComponent,
    canActivate: [AuthGuard],
    data: { role: ['instructor'] }
  },
  {
    path: 'authoring/:courseId/units',
    title: 'Tutor - Autorstvo',
    component: CourseStructureComponent,
    canActivate: [AuthGuard],
    data: { role: ['instructor'] },
  },
  {
    path: 'authoring/:courseId/units/:unitId/learning-tasks/:ltId',
    component: LearningTaskComponent,
    canActivate: [AuthGuard],
    data: { role: ['instructor'] },
  },
  {
    path: 'authoring/:courseId/units/:unitId/knowledge-components/:kcId',
    component: KnowledgeComponentAuthoringComponent,
    canActivate: [AuthGuard],
    data: { role: ['instructor'] },
    children: [
      {
        path: 'instruction',
        component: InstructionalItemsComponent,
        canDeactivate: [ConfirmExitGuard]
      },
      {
        path: 'assessments',
        component: AssessmentItemsComponent,
        canDeactivate: [ConfirmExitGuard]
      }
    ]
  },

  
  {
    path: 'management/stakeholders/learners',
    title: 'Tutor - Studenti',
    component: LearnersComponent,
    canActivate: [AuthGuard],
    data: { role: ['administrator'] },
  },
  {
    path: 'management/stakeholders/instructors',
    title: 'Tutor - Mentori',
    component: InstructorsComponent,
    canActivate: [AuthGuard],
    data: { role: ['administrator'] },
  },
  {
    path: 'management/courses',
    title: 'Tutor - Moduli',
    component: CoursesComponent,
    canActivate: [AuthGuard],
    data: { role: ['administrator'] },
  },
  {
    path: 'monitoring/overview',
    title: 'Tutor - Aktivna nastava',
    component: CourseMonitoringComponent,
    canActivate: [AuthGuard],
    data: { role: ['administrator', 'instructor'] },
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
