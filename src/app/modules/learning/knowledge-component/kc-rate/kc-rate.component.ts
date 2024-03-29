import {Component, Inject} from '@angular/core';
import {MatChip} from "@angular/material/chips";
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

  tags = ["Količina zadataka", "Težina zadataka", "Jasnoća zadataka", "Jasnoća gradiva"]
  selectedTags: string[] = [];

  feedbackMessage = "Veština savladana, bravo 🥳!\nPređi na sledeću (taster \"Lekcija\") ili vidi komentar na zadatak (taster \"Zatvori\")."

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

  selectTag(selectedTag: MatChip) {
    selectedTag.toggleSelected();
    if(this.selectedTags.includes(selectedTag.value)) {
      this.selectedTags = this.selectedTags.filter(tag => tag !== selectedTag.value)
    } else {
      this.selectedTags.push(selectedTag.value)
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
