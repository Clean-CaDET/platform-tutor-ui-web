import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CourseStructureService } from '../../course-structure/course-structure.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'cc-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnChanges {

  @Input() activity: any;
  subactivities: any[];
  @Input() selectedActivity: any;
  @Output() activitySelected = new EventEmitter<any>();
  @Output() deleteActivity = new EventEmitter<number>();

  constructor(private courseService: CourseStructureService, private route: ActivatedRoute) { }

  ngOnChanges(): void {
    this.route.params.subscribe((params: Params) => {
      this.courseService.getSubactivities(+params.courseId, this.activity.id).subscribe(subactivities => {
        this.subactivities = subactivities.sort((s1, s2) => s1.order - s2.order);
        const subactivitiesWithOrder = subactivities
          .filter(a => this.activity.subactivities.some((sa: { childId: any; }) => sa.childId === a.id))
          .map(a => {
            const subactivity = this.activity.subactivities.find((sa: { childId: any; }) => sa.childId === a.id);
            a.order = subactivity?.order || 0;
            return a;
          });
        this.subactivities = subactivitiesWithOrder.sort((s1, s2) => s1.order - s2.order);
        console.log(this.subactivities);
      });
    });
  }

  select(activity: any) {
    this.activitySelected.emit(activity);
  }

  delete(activityId: number) {
    this.deleteActivity.emit(activityId);
  }

}
