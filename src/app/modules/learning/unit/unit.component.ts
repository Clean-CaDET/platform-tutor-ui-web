import { Component, Injectable, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TutorImprovementComponent } from './tutor-improvement/tutor-improvement.component';
import { Unit } from '../model/unit.model';
import { UnitService } from './unit.service';

@Component({
  selector: 'cc-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css'],
})
@Injectable({ providedIn: 'root' })
export class UnitComponent implements OnInit {
  unit: Unit;

  constructor(
    private unitService: UnitService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.unitService
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
