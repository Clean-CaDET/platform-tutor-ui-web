import { Component, Input, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Course } from '../../model/course.model';
import { CourseService } from '../course.service';

@Component({
  selector: 'cc-course-units',
  templateUrl: './course-units.component.html',
  styleUrls: ['./course-units.component.scss'],
})
export class CourseUnitsComponent implements OnInit {
  @Input() course: Course;
  masteredUnitIds: number[];

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private courseService: CourseService) {
    iconRegistry.addSvgIcon(
      "medal",
       sanitizer.bypassSecurityTrustResourceUrl("../../../../../assets/icons/medal.svg")
    );
  }

  ngOnInit(): void {
    const unitIds: number[] = [];
    this.course.knowledgeUnits.forEach(
      unit => unitIds.push(unit.id)
    )
    this.courseService.getMasteredUnitIds(unitIds)
      .subscribe(masteredUnitIds => this.masteredUnitIds = masteredUnitIds);
  }

  isMastered(unitId: number): boolean {
    return this.masteredUnitIds?.includes(unitId);
  }

}
