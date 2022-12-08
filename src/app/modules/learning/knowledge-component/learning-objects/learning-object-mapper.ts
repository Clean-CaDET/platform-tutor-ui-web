import { Injectable } from '@angular/core';
import { LearningObject } from './learning-object.model';
import { Text } from './text/text.model';
import { Image } from './image/image.model';
import { Video } from './video/video.model';
import { MultipleReponseQuestion } from './multiple-response-question/model/multiple-response-question.model';
import { ArrangeTask } from './arrange-task/model/arrange-task.model';
import { ShortAnswerQuestion } from './short-answer-question/short-answer-question.model';
import { Challenge } from './challenge/challenge.model';
import { MultipleChoiceQuestion } from './multiple-choice-question/model/multiple-choice-question.model';

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
