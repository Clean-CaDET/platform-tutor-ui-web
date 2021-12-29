import { Component, OnInit } from '@angular/core';
import {UnitService} from '../../domain/unit/unit.service';
import {Unit} from '../../domain/unit/unit.model';

@Component({
  selector: 'cc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  units: Unit[];

  constructor(private unitService: UnitService) { }

  ngOnInit(): void {
    this.unitService.getUnits().subscribe(units => this.units = units);
  }

}
