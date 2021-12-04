import {Component, OnInit} from '@angular/core';
import {UnitService} from './unit.service';
import {Unit} from './model/unit.model';
import {NavbarService} from '../../navbar/navbar.service';

@Component({
  selector: 'cc-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {

  units: Unit[];
  selectedUnit: Unit;

  constructor(private unitService: UnitService, private navBarService: NavbarService) {
  }

  ngOnInit(): void {
    this.navBarService.currentUnit.subscribe(unit => this.selectedUnit = unit);
  }
}
