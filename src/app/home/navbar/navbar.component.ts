import { Component, OnInit } from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import { NavigationService } from './services/navigation.service';

export interface ContentNode {
  name: string;
  link: string;
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

  constructor(private navigationService: NavigationService) { }

  private getTreeData(): ContentNode[] {
    return [
      {
        name: 'Lectures',
        link: '/lecture',
        children: this.navigationService.getLectureRoutes()
      }
    ];
  }

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
    this.dataSource.data = this.getTreeData();
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

}
