import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Course } from '../../learning/model/course.model';
import { Unit } from '../../learning/model/unit.model';
import { CourseStructureService } from './course-structure.service';

@Component({
  selector: 'cc-course-structure',
  templateUrl: './course-structure.component.html',
  styleUrls: ['./course-structure.component.scss']
})
export class CourseStructureComponent implements OnInit {
  course: Course
  selectedUnit: Unit;
  showUnitDetails: boolean;
  showKnowledgeComponents: boolean;

  constructor(private courseService: CourseStructureService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.courseService.getCourse(+params.courseId).subscribe((course) => (this.course = course));
    });
  }

  createUnit() {
    this.selectedUnit = { code: '', name: '', description: ''};
    this.showUnitDetails = true;
    this.showKnowledgeComponents = false;
  }

}
