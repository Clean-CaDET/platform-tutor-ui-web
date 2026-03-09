import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { LearningObject } from '../../model/learning-object.model';
import { TextItemComponent } from '../instructional-items/text/text.component';
import { VideoItemComponent } from '../instructional-items/video/video.component';
import { ImageItemComponent } from '../instructional-items/image/image.component';
import { McqComponent } from '../assessment-items/mcq/mcq.component';
import { MrqComponent } from '../assessment-items/mrq/mrq.component';
import { SaqComponent } from '../assessment-items/saq/saq.component';

@Component({
  selector: 'cc-learning-object-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextItemComponent, VideoItemComponent, ImageItemComponent, McqComponent, MrqComponent, SaqComponent],
  template: `
    @switch (item().$type) {
      @case ('text') { <cc-text-item [item]="$any(item())" /> }
      @case ('video') { <cc-video-item [item]="$any(item())" /> }
      @case ('image') { <cc-image-item [item]="$any(item())" /> }
      @case ('multiChoiceQuestion') { <cc-mcq [item]="$any(item())" /> }
      @case ('multiResponseQuestion') { <cc-mrq [item]="$any(item())" /> }
      @case ('shortAnswerQuestion') { <cc-saq [item]="$any(item())" /> }
    }
  `,
})
export class LearningObjectContainerComponent {
  readonly item = input.required<LearningObject>();
}
