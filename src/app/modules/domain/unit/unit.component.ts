import {Component, Injectable, OnInit} from '@angular/core';
import {UnitService} from './unit.service';
import {ActivatedRoute, Data} from '@angular/router';

@Component({
  selector: 'cc-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css']
})
@Injectable({providedIn: 'root'})
export class UnitComponent implements OnInit {

  data: Data;

  constructor(private unitService: UnitService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.data = this.route.snapshot.data;
  }
}
