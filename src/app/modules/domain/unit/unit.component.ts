import {Component, Injectable, OnInit} from '@angular/core';
import {UnitService} from './unit.service';
import {ActivatedRoute} from '@angular/router';
import {Unit} from './unit.model';
import {AuthenticationService} from '../../../infrastructure/auth/auth.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {TutorImprovementComponent} from '../feedback/tutor-improvement/tutor-improvement.component';

@Component({
  selector: 'cc-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
@Injectable({providedIn: 'root'})
export class UnitComponent implements OnInit {
  unit: Unit;

  constructor(private unitService: UnitService, private authService: AuthenticationService,
              private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.unitService.getUnit(this.route.snapshot.params.unitId, this.authService.user$.value.learnerId)
        .subscribe(unit => this.unit = unit);
    });
  }

  openImprovementDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {unitId: this.unit.id};
    this.dialog.open(TutorImprovementComponent, dialogConfig);
  }
}
