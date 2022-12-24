import { Injectable } from '@angular/core';
import { LearningObject } from './learning-object.model';
import { Text } from './instructional-items/text/text.model';
import { Video } from './instructional-items/video/video.model';
import { MultipleReponseQuestion } from './assesment-items/multiple-response-question/multiple-response-question.model';
import { MultipleChoiceQuestion } from './assesment-items/multiple-choice-question/multiple-choice-question.model';
import { ArrangeTask } from './assesment-items/arrange-task/arrange-task.model';
import { Image } from './instructional-items/image/image.model';
import { ShortAnswerQuestion } from './assesment-items/short-answer-question/short-answer-question.model';
import { Challenge } from './assesment-items/challenge/challenge.model';

@Injectable({
  providedIn: 'root',
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
        return new MultipleReponseQuestion(learningObject);
      case 'multiChoiceQuestion':
        return new MultipleChoiceQuestion(learningObject);
      case 'arrangeTask':
        return new ArrangeTask(learningObject);
      case 'shortAnswerQuestion':
        return new ShortAnswerQuestion(learningObject);
      case 'challenge':
        return new Challenge(learningObject);
    }
    return null;
  }
}
