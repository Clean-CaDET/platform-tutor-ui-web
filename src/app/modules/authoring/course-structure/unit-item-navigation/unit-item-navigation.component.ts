import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { UnitItem, UnitItemType } from './unit-item.model';
import { UnitItemService } from './unit-item.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'cc-unit-item-navigation',
  templateUrl: './unit-item-navigation.component.html',
  styleUrl: './unit-item-navigation.component.scss'
})
export class UnitItemNavigationComponent implements OnInit, OnDestroy {
  courseId: number;
  allItems: UnitItem[];
  
  selectedItem: UnitItem;
  nextItem: UnitItem;
  nextLink: string;
  prevItem: UnitItem;
  prevLink: string;

  routeSubscription: any;

  constructor(private itemService: UnitItemService, private route: ActivatedRoute, private title: Title) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params: Params) => {
      if(!this.allItems?.length) {
        this.courseId = +params.courseId;
        forkJoin([
          this.itemService.getKcs(+params.unitId),
          this.itemService.getTasks(+params.unitId)
        ]).subscribe({
          next: ([kcResults, taskResults]) => {
            kcResults.push(...taskResults);
            this.allItems = kcResults.sort((a, b) => a.order - b.order);
            this.setItems(+params.itemId);
          },
          error: error => {
            console.log(error);
          }
        });
      } else {
        this.setItems(+params.itemId);
      }
    });
  }

  private setItems(activeItemId: number) {
    const index = this.allItems.findIndex(i => i.id == activeItemId);
    this.selectedItem = this.allItems[index];
    this.prevItem = index != 0 ? this.allItems[index-1] : null;
    this.nextItem = index != this.allItems.length - 1 ? this.allItems[index+1] : null;
    
    this.selectedItem.type === UnitItemType.Kc ?
      this.title.setTitle("Tutor - Znanje - " + this.selectedItem.name) :
      this.title.setTitle("Tutor - Zadatak - " + this.selectedItem.name);
    this.prevLink = this.prevItem.type === UnitItemType.Kc ?
      `/authoring/course/${this.courseId}unit/${this.prevItem.unitId}/knowledge-component/${this.prevItem.id}/instruction` :
      `/authoring/course/${this.courseId}unit/${this.prevItem.unitId}/learning-task/${this.prevItem.id}`;
    this.nextLink = this.nextItem.type === UnitItemType.Kc ?
      `/authoring/course/${this.courseId}unit/${this.nextItem.unitId}/knowledge-component/${this.nextItem.id}/instruction` :
      `/authoring/course/${this.courseId}unit/${this.nextItem.unitId}/learning-task/${this.nextItem.id}`;

    this.scrollToTop();
  }
  
  private scrollToTop() {
    setTimeout(() => { document.querySelector('#scroller').scroll({top: 0})}, 50);
  }
  
  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

}
