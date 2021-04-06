import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTreeModule} from '@angular/material/tree';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatTreeModule,
    MatListModule,
    MatInputModule
  ],
  exports: [
    MatButtonModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatTreeModule,
    MatListModule,
    MatInputModule
  ]
})
export class MaterialModule { }
