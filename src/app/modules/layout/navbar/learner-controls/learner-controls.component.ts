import { Component, OnInit, } from '@angular/core';
import { NavigationEnd, Params, ActivatedRoute, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { Course } from '../../../learning/model/course.model';
import { LayoutService } from '../../layout.service';

@Component({
  selector: 'cc-learner-controls',
  templateUrl: './learner-controls.component.html',
  styleUrls: ['./learner-controls.component.scss'],
})
export class LearnerControlsComponent implements OnInit {
  courses: Course[];
  selectedCourse: Course;

  constructor(private layoutService: LayoutService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.layoutService.getLearnerCourses().subscribe((coursesPage) => {
      this.courses = coursesPage.results;
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
        map((e) => this.getParams(this.route))
      )
      .subscribe((params) => {
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

  private courseIsChanged(params: Params) {
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
}
