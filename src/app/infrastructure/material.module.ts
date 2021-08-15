import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTreeModule} from '@angular/material/tree';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTableModule} from '@angular/material/table';
import {MatOptionModule} from '@angular/material/core';

@NgModule({
  imports: [
    MatButtonModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatTreeModule,
    MatListModule,
    MatInputModule,
    MatCardModule,
    MatRippleModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatTableModule,
    MatOptionModule,
  ],
  exports: [
    MatButtonModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatTreeModule,
    MatListModule,
    MatInputModule,
    MatCardModule,
    MatRippleModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatTableModule,
    MatOptionModule,
  ]
})
export class MaterialModule {
}
