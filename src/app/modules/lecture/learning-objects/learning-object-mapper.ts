import { Injectable } from '@angular/core';
import { LearningObject } from '../../../model/learning-object/learning-object.model';
import { Text } from '../../../model/text/text.model';
import { Image } from '../../../model/image/image.model';
import { Video } from '../../../model/video/video.model';
import { Question } from '../../../model/question/question.model';
import { ArrangeTask } from '../../../model/arrange-task/arrange-task.model';
import { Challenge } from '../../../model/challenge/challenge.model';

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
      case 'question':
        return new Question(learningObject);
      case 'arrangeTask':
        return new ArrangeTask(learningObject);
      case 'challenge':
        return new Challenge(learningObject);
    }
    return null;
  }
}
