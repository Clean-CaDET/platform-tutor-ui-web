import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Video } from 'src/app/modules/learning/knowledge-component/learning-objects/instructional-items/video/video.model';

@Component({
  selector: 'cc-video-authoring',
  templateUrl: './video-authoring.component.html',
  styleUrls: ['./video-authoring.component.scss']
})
export class VideoAuthoringComponent implements OnInit {
  @Input() video: Video;
  @Output() videoCreated = new EventEmitter<Video>();

  videoForm: FormGroup

  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    this.videoForm = this.builder.group({
      caption: new FormControl(this.video?.caption || '', Validators.required),
      url: new FormControl(this.video?.url || '', Validators.required)
    });
    if(this.video?.id) {
      this.videoForm.patchValue(this.video);
    }
  }

  updateVideoItem(cancel: boolean): void {
    if(cancel) {
      this.videoCreated.emit(null);
      return;
    }

    this.video.caption = this.videoForm.value['caption'];
    this.video.url = this.videoForm.value['url'];
    this.videoCreated.emit(this.video);
  }
}
