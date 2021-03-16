import { Injectable } from '@angular/core';
import { KnowledgeNode } from '../knowledge-node/model/knowledge-node.model';
import { Text } from '../knowledge-node/learning-objects/text/model/text.model';
import { LearningObjectRole } from '../knowledge-node/learning-objects/enum/learning-object-role.enum';
import { Image } from '../knowledge-node/learning-objects/image/model/image.model';
import { Video } from '../knowledge-node/learning-objects/video/model/video.model';

@Injectable({
  providedIn: 'root'
})
export class LectureService {

  constructor() { }

  getLecture(): KnowledgeNode[] {
    const knowledgeNode = new KnowledgeNode();
    knowledgeNode.learningObjects = [];

    knowledgeNode.learningObjects.push(
      new Text(
        '<b>Cohesion</b> is the degree to which a part of a code base forms a meaningful atomic module<sup>1</sup>.' +
        ' The components of a highly cohesive module work together towards a common, well defined goal' +
        ' and have a clear (single) responsibility. This responsibility is defined by the module’s name' +
        ' and described by its interface that sets its inputs and outputs.',
        LearningObjectRole.Definition
      ),
      new Image('https://miro.medium.com/max/700/1*3jfye6OQFu_dROKb14BhaQ.png',
        'The left class is playing with a few responsibilities, more than its name suggests anyway...',
        LearningObjectRole.Example
      ),
      new Video('qE-Gmu_YuQE', LearningObjectRole.Example)
    );
    return [knowledgeNode];
  }
}
