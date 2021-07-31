import {Component, OnInit} from '@angular/core';
import {NavigationExtras} from '@angular/router';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'cc-teacher-home-page',
  templateUrl: './teacher-home-page.component.html',
  styleUrls: ['./teacher-home-page.component.css']
})
export class TeacherHomePageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
  }

  navigate(link: string): void {
    this.router.navigate([link], {relativeTo: this.route});
  }
}
