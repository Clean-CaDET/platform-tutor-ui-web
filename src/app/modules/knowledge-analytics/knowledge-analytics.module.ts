import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KcStatisticsComponent } from './kc-statistics/kc-statistics.component';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MaterialModule } from 'src/app/infrastructure/material.module';

@NgModule({
  declarations: [KcStatisticsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxChartsModule,
    MatExpansionModule,
  ],
})
export class KnowledgeAnalyticsModule {}
