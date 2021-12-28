import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {KnowledgeComponent} from '../knowledge-component/model/knowledge-component.model';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {NestedTreeControl} from '@angular/cdk/tree';

@Component({
  selector: 'cc-knowledge-map',
  templateUrl: './knowledge-map.component.html',
  styleUrls: ['./knowledge-map.component.scss']
})
export class KnowledgeMapComponent implements OnChanges {
  @Input() knowledgeComponents: KnowledgeComponent[];
  @Output() selectedKC = new EventEmitter<KnowledgeComponent>();

  treeControl = new NestedTreeControl<KnowledgeComponent>(node => node.knowledgeComponents);

  dataSource = new MatTreeNestedDataSource<KnowledgeComponent>();

  hasChild = (_: number, node: KnowledgeComponent) => !!node.knowledgeComponents && node.knowledgeComponents.length > 0;

  constructor() { }

  ngOnChanges(): void {
    this.dataSource.data = this.knowledgeComponents;
  }
}
