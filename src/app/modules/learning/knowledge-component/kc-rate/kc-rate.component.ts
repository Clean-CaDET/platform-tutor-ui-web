import {Component, Inject} from '@angular/core';
import {KnowledgeComponentRate} from "../../model/knowledge-component-rate.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {KcRateService} from "./kc-rate.service";

@Component({
  selector: 'cc-kc-rate',
  templateUrl: './kc-rate.component.html',
  styleUrls: ['./kc-rate.component.scss']
})
export class KcRateComponent {

  courseId: number;
  unitId: number;
  kcId: number;

  isRated: boolean = false;
  rating: number;

  tags = ["Količina pitanja", "Težina pitanja", "Jasnoća pitanja", "Jasnoća gradiva"]
  selectedTags: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) data: { courseId: number, unitId:number, kcId:number },
              private dialogRef: MatDialogRef<KcRateComponent>, private rateService : KcRateService) {
    this.courseId = data.courseId;
    this.unitId = data.unitId;
    this.kcId = data.kcId;
  }

  rate(event: any): void {
    this.rating = event.rating;
    this.isRated = true;
  }

  selectTag(selectedTag: string) {
    if(this.selectedTags.includes(selectedTag)) {
      this.selectedTags = this.selectedTags.filter(tag => tag !== selectedTag);
    } else {
      this.selectedTags.push(selectedTag);
    }
  }

  closeDialog() {
    if(this.isRated) {
      const kcRate: KnowledgeComponentRate = {
        knowledgeComponentId: this.kcId,
        rating: this.rating,
        tags: this.selectedTags
      };
      this.rateService.rate(kcRate).subscribe(_ => {
        this.dialogRef.close();
      })
    } else {
      this.dialogRef.close();
    }
  }
}
