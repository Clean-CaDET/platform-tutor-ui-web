import { Component, OnInit } from '@angular/core';
import {UnitService} from './unit.service';
import {Unit} from './model/unit.model';

@Component({
  selector: 'cc-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
export class UnitComponent implements OnInit {

  units: Unit[];

  constructor(private unitService: UnitService) { }

  ngOnInit(): void {
    this.unitService.getUnits().subscribe(units => this.units = units);
  }

}
