import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'cc-admin-controls',
  templateUrl: './admin-controls.component.html',
  styleUrls: ['./admin-controls.component.scss']
})
export class AdminControlsComponent implements OnInit {
  selectedControl: string;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events.subscribe(e => this.getActiveUrl(e));
  }

  private getActiveUrl(e: any) {
    if(!e?.url) return;
    if (e.url.includes('courses')) {
      this.selectedControl = 'courses';
    }
    if (e.url.includes('learners')) {
      this.selectedControl = 'learners';
    }
    if (e.url.includes('instructors')) {
      this.selectedControl = 'instructors';
    }
  }
}
