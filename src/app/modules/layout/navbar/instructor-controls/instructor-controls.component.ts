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
  groups: LearnerGroup[];
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
    this.setupGroupUpdate();
    this.layoutInstructorService.getCourses().subscribe((courses) => {
      this.courses = courses;
    });
    this.layoutService.getGroups().subscribe((groups) => {
      this.groups = groups;
      this.selectedGroup = this.groups.find(
        (g) => g.id == this.getParams(this.route).groupId
      ); // extract this common behavior somewhere
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

  private setupGroupUpdate(): void {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => this.getParams(this.route))
      )
      .subscribe((params) => {
        if (!params.groupId) {
          this.selectedGroup = null;
          return;
        }
        if (this.groupIsChanged(params)) {
          this.selectedGroup = this.groups?.find(
            (g) => g.id == +params.groupId
          );
        }
      });
  }

  private groupIsChanged(params: Params) {
    return this.selectedGroup?.id != params.groupId;
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

interface LearnerGroup {
  id: number;
  name: string;
}
