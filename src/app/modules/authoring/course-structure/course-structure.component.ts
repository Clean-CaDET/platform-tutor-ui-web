import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
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

  constructor(private courseService: CourseStructureService, private route: ActivatedRoute, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.courseService.getCourse(+params.courseId).subscribe(course => {
        course.knowledgeUnits = course.knowledgeUnits.sort((u1, u2) => u1.order - u2.order);
        this.course = course;
        let unitId = this.route.snapshot.queryParams['unit'];
        if(unitId) {
          this.selectedUnit = this.course.knowledgeUnits.find(u => u.id == unitId);
          this.showKnowledgeComponents = true;
        }
      });  
    });
  }

  updateCourse(newCourse: Course): void {
    this.courseService.updateCourse(newCourse).subscribe(updatedCourse => {
      updatedCourse.knowledgeUnits = this.course.knowledgeUnits;
      this.course = updatedCourse;
    });
  }

  createUnit() {
    this.selectedUnit = { code: '', name: '', description: '', order:this.getMaxOrder()+10};
    this.showUnitDetails = true;
    this.showKnowledgeComponents = false;
  }

  getMaxOrder(): number {
    if(this.course.knowledgeUnits?.length == 0) return 0;
    return Math.max(...this.course.knowledgeUnits.map(u => u.order));
  }

  saveOrUpdateUnit(unit: Unit) {
    if(!unit.id) {
      this.courseService.saveUnit(this.course.id, unit).subscribe(newUnit => {
        this.course.knowledgeUnits.push(newUnit);
        this.course.knowledgeUnits = [...this.course.knowledgeUnits.sort((u1, u2) => u1.order - u2.order)];
        this.selectedUnit = newUnit;
      });
    } else {
      this.courseService.updateUnit(this.course.id, unit).subscribe(updatedUnit => {
        let unit = this.course.knowledgeUnits.find(u => u.id === updatedUnit.id);
        unit.code = updatedUnit.code;
        unit.name = updatedUnit.name;
        unit.description = updatedUnit.description;
        unit.order = updatedUnit.order;
        this.course.knowledgeUnits = [...this.course.knowledgeUnits.sort((u1, u2) => u1.order - u2.order)];
      });
    }
  }

  deleteUnit(unitId: number): void {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if(!result) return;
      
      this.courseService.deleteUnit(this.course.id, unitId).subscribe(() => {
        this.course.knowledgeUnits = [...this.course.knowledgeUnits.filter(u => u.id !== unitId)];
        this.selectedUnit = null;
      });
    });
  }
}
