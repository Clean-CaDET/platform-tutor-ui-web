import { Component, Input, OnChanges } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Course } from '../../model/course.model';
import { CourseService } from '../course.service';

@Component({
  selector: 'cc-course-units',
  templateUrl: './course-units.component.html',
  styleUrls: ['./course-units.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      state('out', style({ height: '0', opacity: 0, overflow: 'hidden' })),
      transition('in => out', [ animate('300ms ease-in-out') ]),
      transition('out => in', [ animate('300ms ease-in-out') ])
    ])
  ]
})
export class CourseUnitsComponent implements OnChanges {
  @Input() course: Course;
  now: Date;
  showNotes: boolean[] = [];
  notesLoaded: boolean[] = []; // Track which units have had their notes loaded

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private courseService: CourseService) {
    iconRegistry.addSvgIcon(
      "medal",
       sanitizer.bypassSecurityTrustResourceUrl("../../../../../assets/icons/medal.svg")
    );
  }

  ngOnChanges(): void {
    this.now = new Date();
    this.showNotes = new Array(this.course.knowledgeUnits.length).fill(false);
    this.notesLoaded = new Array(this.course.knowledgeUnits.length).fill(false);
    
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

  toggleNotes(index: number): void {
    this.showNotes[index] = !this.showNotes[index];
    
    if (this.showNotes[index] && !this.notesLoaded[index]) {
      this.notesLoaded[index] = true;
    }
  }
}