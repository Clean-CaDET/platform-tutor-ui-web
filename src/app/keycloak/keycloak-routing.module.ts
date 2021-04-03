import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KeycloakComponent } from './keycloak.component';

const routes: Routes = [{ path: '', component: KeycloakComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KeycloakRoutingModule { }
