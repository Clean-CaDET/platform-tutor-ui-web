import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DeleteFormComponent } from 'src/app/shared/generics/delete-form/delete-form.component';
import { Course } from '../../learning/model/course.model';
import { Unit } from '../../learning/model/unit.model';
import { CourseStructureService } from './course-structure.service';
import { UnitItem } from '../unit-items/unit-item.model';

@Component({
  selector: 'cc-course-structure',
  templateUrl: './course-structure.component.html',
  styleUrls: ['./course-structure.component.scss']
})
export class CourseStructureComponent implements OnInit {
  course: Course
  selectedUnit: Unit;
  displayDetails: boolean;
  displayItems: boolean;
  items: UnitItem[];

  constructor(private courseService: CourseStructureService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.courseService.getCourse(+params.courseId).subscribe(course => {
        course.knowledgeUnits = course.knowledgeUnits.sort((u1, u2) => u1.order - u2.order);
        this.course = course;

        let unitId = this.route.snapshot.queryParams['unit'];
        if (unitId) {
          let unit = this.course.knowledgeUnits.find(u => u.id == unitId);
          if(!unit) return;
          let mode = this.route.snapshot.queryParams['mode'];
          mode == 'items' ? this.showItems(unit) : this.showDetails(unit);
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
    this.selectedUnit = { code: '', name: '', goals: '', order: this.getMaxOrder() + 10 };
    this.displayDetails = true;
    this.displayItems = false;
  }

  getMaxOrder(): number {
    if (this.course.knowledgeUnits?.length == 0) return 0;
    return Math.max(...this.course.knowledgeUnits.map(u => u.order));
  }

  showDetails(unit: Unit) {
    this.selectedUnit = unit;
    this.displayDetails = true;
    this.displayItems = false;

    this.router.navigate([], {
      queryParams: { unit: unit.id, mode: '' },
      queryParamsHandling: 'merge'
    });
  }

  showItems(unit: Unit) {
    this.selectedUnit = unit;
    this.displayDetails = false;
    this.displayItems = true;

    this.router.navigate([], {
      queryParams: { unit: unit.id, mode: 'items' },
      queryParamsHandling: 'merge'
    });
  }

  saveOrUpdateUnit(unit: Unit) {
    if (!unit.id) {
      this.courseService.saveUnit(this.course.id, unit).subscribe(newUnit => {
        newUnit.knowledgeComponents = [];
        this.course.knowledgeUnits.push(newUnit);
        this.course.knowledgeUnits = [...this.course.knowledgeUnits.sort((u1, u2) => u1.order - u2.order)];
        this.selectedUnit = newUnit;
        setTimeout(() => {
          const element = document.querySelector('#u'+this.selectedUnit.id)!;
          element.scrollIntoView({behavior: 'smooth', block:'start'});
        }, 100);
      });
    } else {
      this.courseService.updateUnit(this.course.id, unit).subscribe(updatedUnit => {
        let unit = this.course.knowledgeUnits.find(u => u.id === updatedUnit.id);
        unit.code = updatedUnit.code;
        unit.name = updatedUnit.name;
        unit.introduction = updatedUnit.introduction;
        unit.goals = updatedUnit.goals;
        unit.guidelines = updatedUnit.guidelines;
        unit.order = updatedUnit.order;
        this.course.knowledgeUnits = [...this.course.knowledgeUnits.sort((u1, u2) => u1.order - u2.order)];
      });
    }
  }

  deleteUnit(unitId: number): void {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.courseService.deleteUnit(this.course.id, unitId).subscribe(() => {
        this.course.knowledgeUnits = [...this.course.knowledgeUnits.filter(u => u.id !== unitId)];
        this.selectedUnit = null;
      });
    });
  }
}