import { Component, OnInit } from '@angular/core';
import { LearningObjectComponent } from '../learning-object-component';
import { Image } from './model/image.model';

@Component({
  selector: 'cc-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit, LearningObjectComponent {

  data: Image;

  constructor() { }

  ngOnInit(): void {
  }

}
