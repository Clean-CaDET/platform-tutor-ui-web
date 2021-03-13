import { Component, OnInit } from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';

interface ContentNode {
  name: string;
  link: string;
  children?: ContentNode[];
}

const TREE_DATA: ContentNode[] = [
  {
    name: 'Clean Classes',
    link: '/clean-classes',
    children: [
      {name: 'Cohesion', link: '/clean-classes/cohesion'},
      {name: 'Coupling', link: '/clean-classes/coupling'},
      {name: 'Responsibilities', link: '/clean-classes/responsibilities'}
    ]
  }, {
    name: 'Clean Methods',
    link: '/clean-methods',
    children: [
      {name: 'Complexity', link: '/clean-methods/complexity'},
      {name: 'Responsibilities', link: '/clean-methods/responsibilities'}
    ]
  },
];

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'cc-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  treeControl: FlatTreeControl<FlatNode>;
  dataSource: MatTreeFlatDataSource<any, any>;


  ngOnInit(): void {
    const transformer = (node: ContentNode, level: number) => {
      return {
        expandable: !!node.children && node.children.length > 0,
        name: node.name,
        link: node.link,
        level
      };
    };
    const treeFlattener = new MatTreeFlattener(transformer, node => node.level, node => node.expandable, node => node.children);
    this.treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, treeFlattener);
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

}
