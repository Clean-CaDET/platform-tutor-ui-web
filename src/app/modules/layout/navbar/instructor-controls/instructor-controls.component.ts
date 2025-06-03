import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router';
import { filter, map } from 'rxjs';
import { Course } from 'src/app/modules/learning/model/course.model';
import {LayoutService} from '../../layout.service';

@Component({
  selector: 'cc-instructor-controls',
  templateUrl: './instructor-controls.component.html',
  styleUrls: ['./instructor-controls.component.scss'],
})
export class InstructorControlsComponent implements OnInit {
  selectedCourse: Course;
  courses: Course[];
  selectedControl = 'monitoring';
  selectedSubcontrol = 'progress';

  constructor(
    private layoutService: LayoutService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.deriveSelectedControls(window.location.href);
    this.layoutService.getInstructorCourses().subscribe((courses) => {
      this.courses = courses;
      let params = this.getParams(this.route);
      if(params.courseId) {
        this.selectCourse(+params.courseId);
      }
      this.setupCourseUpdate();
    });
  }

  private setupCourseUpdate(): void {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map(_ => this.getParams(this.route))
      )
      .subscribe((params) => {
        this.deriveSelectedControls(window.location.href);
        if (!params.courseId) {
          this.selectedCourse = null;
          return;
        }
        if (this.courseIsChanged(params)) {
          this.selectCourse(+params.courseId);
        }
      });
  }

  private selectCourse(courseId: number): void{
    this.selectedCourse = this.courses?.find((c) => c.id === courseId);
  }

  private courseIsChanged(params: Params): boolean {
    return this.selectedCourse?.id !== params.courseId;
  }

  private getParams(route: ActivatedRoute): Params {
    let params = route.snapshot.params;
    route.children?.forEach((c) => {
      params = {
        ...this.getParams(c),
        ...params,
      };
    });
    return params;
  }

  private deriveSelectedControls(url: string) {
    if (url.includes('monitoring')) {
      this.selectedControl = 'monitoring';
      if (url.includes('enrollments')) {
        this.selectedSubcontrol = 'enrollments';
      } else if (url.includes('grading')) {
        this.selectedSubcontrol = 'grading';
      } else {
        this.selectedSubcontrol = 'progress';
      }
    }
    else if (url.includes('authoring')) {
      this.selectedControl = 'authoring';
      this.selectedSubcontrol = 'units';
    }
    else if (url.includes('analytics')) {
      this.selectedControl = 'analytics';
      this.selectedSubcontrol = 'statistics';
    }
    else {
      this.selectedControl = 'monitoring';
      this.selectedSubcontrol = 'progress';
    }
  }
}
