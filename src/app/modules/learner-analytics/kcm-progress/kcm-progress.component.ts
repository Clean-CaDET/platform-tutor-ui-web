import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Unit } from '../../domain/unit/unit.model';
import { LearnerAnalyticsService } from '../learner-analytics.service';

@Component({
  selector: 'cc-kcm-progress',
  templateUrl: './kcm-progress.component.html',
  styleUrls: ['./kcm-progress.component.scss']
})
export class KcmProgressComponent implements OnInit {
  progress: any[];
  count: number;
  page = 1;
  pageSize = 10;
  groupId: number;

  unitId = "0";
  units: Unit[];

  constructor(private route: ActivatedRoute, private analyticsService: LearnerAnalyticsService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.groupId = +params.groupId;
      this.getLearnerProgress();
    });
    this.analyticsService.getUnits().subscribe(units => this.units = units);
  }

  private getLearnerProgress() {
    this.analyticsService.getLearners(this.page, this.pageSize, this.groupId).subscribe(data => {
      this.progress = data.learnersProgress;
      this.count = data.count;
    });
  }

  changePage(paginator) {
    this.page = paginator.pageIndex + 1;
    this.pageSize = paginator.pageSize;
    this.getLearnerProgress();
  }

}
