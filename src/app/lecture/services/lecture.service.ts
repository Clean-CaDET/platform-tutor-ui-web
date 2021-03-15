import { Injectable } from '@angular/core';
import { KnowledgeNode } from '../knowledge-node/model/knowledge-node.model';
import { Text } from '../knowledge-node/learning-objects/text/model/text.model';
import { LearningObjectRole } from '../knowledge-node/learning-objects/enum/learning-object-role.enum';

@Injectable({
  providedIn: 'root'
})
export class LectureService {

  constructor() { }

  getLecture(): KnowledgeNode[] {
    const knowledgeNode = new KnowledgeNode();
    knowledgeNode.learningObjects = [];

    knowledgeNode.learningObjects.push(new Text(
      'Cohesion is the degree to which a part of a code base forms a meaningful atomic module.' +
      ' The components of a highly cohesive module work together towards a common, well defined goal' +
      ' and have a clear (single) responsibility. This responsibility is defined by the module’s name' +
      ' and described by its interface that sets its inputs and outputs.',
      LearningObjectRole.Definition
    ));
    return [knowledgeNode];
  }
}
