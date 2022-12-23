import { Component, Injectable, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TutorImprovementComponent } from './tutor-improvement/tutor-improvement.component';
import { LearningService } from '../learning.service';
import { Unit } from '../model/unit.model';

@Component({
  selector: 'cc-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css'],
})
@Injectable({ providedIn: 'root' })
export class UnitComponent implements OnInit {
  unit: Unit;

  constructor(
    private learningService: LearningService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.learningService
        .getUnit(+params.unitId)
        .subscribe((unit) => (this.unit = unit));
    });
  }

  openImprovementDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { unitId: this.unit.id };
    this.dialog.open(TutorImprovementComponent, dialogConfig);
  }
}
