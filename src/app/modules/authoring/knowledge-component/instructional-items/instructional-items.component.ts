import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LearningObject } from '../../../learning/knowledge-component/learning-objects/learning-object.model';
import { InstructionalItemsService } from './instructional-items.service';

@Component({
  selector: 'cc-instructional-items',
  templateUrl: './instructional-items.component.html',
  styleUrls: ['./instructional-items.component.scss']
})
export class InstructionalItemsComponent implements OnInit {
  instructionalItems: LearningObject[];

  constructor(private instructionService: InstructionalItemsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.instructionService.getAll(+params.kcId).subscribe(instructionalItems => {
        this.instructionalItems = instructionalItems;
      });
    });
  }
}
