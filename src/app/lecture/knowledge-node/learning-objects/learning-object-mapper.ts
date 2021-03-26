import { Injectable } from '@angular/core';
import { LearningObject } from './model/learning-object.model';
import { Text } from './text/model/text.model';
import { Image } from './image/model/image.model';
import { Video } from './video/model/video.model';
import { Question } from './question/model/question.model';

@Injectable({
  providedIn: 'root'
})
export class LearningObjectMapper {
  convert(learningObject: any): LearningObject {
    switch (learningObject.typeDiscriminator) {
      case 'text':
        return new Text(learningObject);
      case 'image':
        return new Image(learningObject);
      case 'video':
        return new Video(learningObject);
      case 'question':
        return new Question(learningObject);
    }
    return null;
  }
}
