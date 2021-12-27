import { Injectable } from '@angular/core';
import { LearningObject } from './learning-object.model';
import { Text } from './text/text.model';
import { Image } from './image/image.model';
import { Video } from './video/video.model';
import { Question } from './question/model/question.model';
import { ArrangeTask } from './arrange-task/model/arrange-task.model';
import { Challenge } from './challenge/challenge.model';

@Injectable({
  providedIn: 'root'
})
export class LearningObjectMapper {
  constructor() {}

  convert(learningObject: any): LearningObject {
    switch (learningObject.typeDiscriminator) {
      case 'text':
        return new Text(learningObject);
      case 'image':
        return new Image(learningObject);
      case 'video':
        return new Video(learningObject);
      case 'multiResponseQuestion':
        return new Question(learningObject);
      case 'arrangeTask':
        return new ArrangeTask(learningObject);
      case 'challenge':
        return new Challenge(learningObject);
    }
    return null;
  }
}
