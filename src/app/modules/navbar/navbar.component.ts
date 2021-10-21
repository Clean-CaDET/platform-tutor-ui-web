import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { LectureService } from '../content/lecture/lecture.service';

export interface ContentNode {
  name: string;
  link: string;
  data?: any;
  children?: ContentNode[];
}

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

  constructor(private lectureService: LectureService) { }

  ngOnInit(): void {
    const transformer = (node: ContentNode, level: number) => {
      return {
        expandable: !!node.children && node.children.length > 0,
        name: node.name,
        link: node.link,
        data: node.data,
        level
      };
    };
    const treeFlattener = new MatTreeFlattener(transformer, node => node.level, node => node.expandable, node => node.children);
    this.treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, treeFlattener);
    this.lectureService.getLectureRoutes().subscribe(routes => {
      this.dataSource.data = [
        {
          name: 'Lecture catalog',
          link: '/lecture',
          children: routes
        }
      ];
      this.treeControl.expandAll();
    });
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

}
