import { Component, Input } from '@angular/core';
import { Unit } from 'src/app/modules/learning/model/unit.model';

@Component({
  selector: 'cc-kc-tree',
  templateUrl: './kc-tree.component.html',
  styleUrls: ['./kc-tree.component.scss']
})
export class KcTreeComponent {
  @Input() unit: Unit;
  nodes = demoData;

  constructor() {}
}

interface TreeNode {
  id: string;
  children: TreeNode[];
  isExpanded?:boolean;
}

var demoData: TreeNode[] = [
  {
    id: 'item 1',
    children:[]
  },
  {
    id: 'item 2',
    children:[
      {
        id: 'item 2.1',
        children:[]
      },
        {
        id: 'item 2.2',
        children:[ {
            id: 'item 2.2.1',
            children: []
        }]
      },
        {
        id: 'item 2.3',
        children:[]
      }
    ]
  },
  {
    id: 'item 3',
    children:[]
  }
]