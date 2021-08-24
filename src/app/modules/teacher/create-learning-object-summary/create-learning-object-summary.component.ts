import {Component, Input, OnInit} from '@angular/core';
import {CreateLearningObjectSummaryService} from './create-learning-object-summary.service';
import {LearningObject} from '../../content/learning-objects/model/learning-object.model';
import {LearningObjectMapper} from '../../content/learning-objects/learning-object-mapper';
import {LearningObjectSummary} from '../../content/learning-object-summary/model/learning-object-summary';
import {Image} from '../../content/learning-objects/image/model/image.model';
import {Video} from '../../content/learning-objects/video/model/video.model';
import {Text} from '../../content/learning-objects/text/model/text.model';
import {VideoComponent} from '../../content/learning-objects/video/video.component';
import {ImageComponent} from '../../content/learning-objects/image/image.component';
import {TextComponent} from '../../content/learning-objects/text/text.component';
import {KnowledgeNode} from '../../content/knowledge-node/model/knowledge-node.model';

@Component({
  selector: 'cc-create-learning-object-summary',
  templateUrl: './create-learning-object-summary.component.html',
  styleUrls: ['./create-learning-object-summary.component.css']
})
export class CreateLearningObjectSummaryComponent implements OnInit {

  @Input() knowledgeNodeId: string;
  selectedType: string;
  learningObjects: LearningObject[];
  description = '';
  editing: boolean;
  content: string;
  url = '';
  caption: string;

  VideoComponent = VideoComponent;
  ImageComponent = ImageComponent;
  TextComponent = TextComponent;

  constructor(private service: CreateLearningObjectSummaryService, private mapper: LearningObjectMapper) {
  }

  ngOnInit(): void {
    this.learningObjects = [];
  }

  selectType(type: string): void {
    this.selectedType = type;
  }

  addLearningObject(obj: LearningObject): void {
    this.learningObjects.push(obj);
  }

  createLearningObjectSummary(): void {
    const learningObjects = this.service.mapNodeLearningObjects(this.learningObjects);
    const learningObjectSummary = new LearningObjectSummary(
      {description: this.description, knowledgeNode: new KnowledgeNode({id: this.knowledgeNodeId}
  ),
    learningObjects: this.learningObjects
  })
    ;
    this.service.createLearningObjectSummary(learningObjectSummary);
  }

  add(): void {
    if (this.selectedType === 'Image') {
      this.learningObjects.push(new Image({
        url: this.url,
        caption: this.caption
      }));
    } else if (this.selectedType === 'Video') {
      this.learningObjects.push(new Video({url: this.url}));
    } else if (this.selectedType === 'Text') {
      this.learningObjects.push(new Text({content: this.content}));
    }
  }

  remove(learningObject: LearningObject): void {
    this.learningObjects = this.learningObjects.filter(lo => lo !== learningObject);
  }
}
