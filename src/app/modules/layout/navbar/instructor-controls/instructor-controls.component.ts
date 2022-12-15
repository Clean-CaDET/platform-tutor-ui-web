import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router';
import { filter, map } from 'rxjs';
import { Course } from 'src/app/modules/learning/course/course.model';
import { LayoutInstructorService } from '../../layout-instructor.service';
import { LayoutService } from '../../layout.service';

@Component({
  selector: 'cc-instructor-controls',
  templateUrl: './instructor-controls.component.html',
  styleUrls: ['./instructor-controls.component.scss'],
})
export class InstructorControlsComponent implements OnInit {
  selectedGroup: any;
  selectedCourse: Course;
  courses: Course[];

  constructor(
    private layoutService: LayoutService,
    private layoutInstructorService: LayoutInstructorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.setupCourseUpdate();
    this.layoutInstructorService.getCourses().subscribe((courses) => {
      this.courses = courses;
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
          this.selectedCourse = this.courses?.find(
            (c) => c.id == +params.courseId
          );
        }
      });
  }

  private courseIsChanged(params: Params) {
    return this.selectedCourse?.id != params.courseId;
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
