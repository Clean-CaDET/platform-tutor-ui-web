import { Component, Input, OnChanges } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Course } from '../../model/course.model';
import { CourseService } from '../course.service';

@Component({
  selector: 'cc-course-units',
  templateUrl: './course-units.component.html',
  styleUrls: ['./course-units.component.scss'],
})
export class CourseUnitsComponent implements OnChanges {
  @Input() course: Course;
  now: Date;

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private courseService: CourseService) {
    iconRegistry.addSvgIcon(
      "medal",
       sanitizer.bypassSecurityTrustResourceUrl("../../../../../assets/icons/medal.svg")
    );
  }

  ngOnChanges(): void {
    this.now = new Date();
    const unitIds: number[] = [];
    this.course.knowledgeUnits.forEach(unit => {
      unit.bestBefore = new Date(unit.bestBefore); // Transform ISO 8601 string to date for comparison.
      if(unit.enrollmentStatus === "Completed") return;
      unitIds.push(unit.id)
    })
    this.courseService.getMasteredUnitIds(this.course.id, unitIds)
      .subscribe(masteredUnitIds => masteredUnitIds.forEach(id => {
        const unit = this.course.knowledgeUnits.find(u => u.id === id);
        unit.enrollmentStatus = "Completed";
      }));
  }
}
