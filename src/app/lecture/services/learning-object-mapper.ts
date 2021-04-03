import { Injectable } from '@angular/core';
import { LearningObject } from '../knowledge-node/learning-objects/model/learning-object.model';
import { Text } from '../knowledge-node/learning-objects/text/model/text.model';
import { Image } from '../knowledge-node/learning-objects/image/model/image.model';
import { Video } from '../knowledge-node/learning-objects/video/model/video.model';
import { Question } from '../knowledge-node/learning-objects/question/model/question.model';
import { ArrangeTask } from '../knowledge-node/learning-objects/arrange-task/model/arrange-task.model';

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
    }
    return null;
  }
}
