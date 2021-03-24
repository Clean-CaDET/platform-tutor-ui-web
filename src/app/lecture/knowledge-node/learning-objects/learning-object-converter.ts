import { LearningObject } from './model/learning-object.model';
import { Text } from './text/model/text.model';
import { Image } from './image/model/image.model';
import { Video } from './video/model/video.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LearningObjectConverter {
  convert(learningObject: any): LearningObject {
    switch (learningObject.typeDiscriminator) {
      case 'text':
        return new Text(learningObject);
      case 'image':
        return new Image(learningObject);
      case 'video':
        return new Video(learningObject);
    }
    return null;
  }
}
