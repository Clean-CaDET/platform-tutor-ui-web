import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TutorImprovementComponent } from './tutor-improvement/tutor-improvement.component';
import { Unit } from '../model/unit.model';
import { UnitService } from './unit.service';
import { KCMastery } from '../model/knowledge-component-mastery.model';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'cc-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css'],
})
export class UnitComponent implements OnInit {
  courseId: number;
  unit: Unit;
  masteries: KCMastery[];

  constructor(
    private unitService: UnitService,
    private route: ActivatedRoute,
    private dialog: MatDialog, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      "medal",
       sanitizer.bypassSecurityTrustResourceUrl("../../../../assets/icons/medal.svg")
    );
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.courseId = +params.courseId;
      this.unitService.getUnit(+params.unitId).subscribe(unit => this.unit = unit);
      this.unitService.getMasteries(+params.unitId).subscribe(masteries => this.masteries = masteries);
    });
  }

  openImprovementDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { unitId: this.unit.id };
    this.dialog.open(TutorImprovementComponent, dialogConfig);
  }

  calcKcs(): number {
    return this.masteries?.length;
  }

  calcSatisfiedKcs(): number {
    return this.masteries?.filter(m => m.isSatisfied == true).length
  }
}
