import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Unit} from './model/unit.model';
import {Injectable} from '@angular/core';
import {UnitService} from './unit.service';

@Injectable({
  providedIn: 'root'
})
export class UnitResolver implements Resolve<Observable<Unit>> {

  constructor(private unitService: UnitService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<Observable<Unit>> | Promise<Observable<Unit>> | Observable<Unit> {
    const unitId = +route.paramMap.get('unitId');
    return this.unitService.getUnit(unitId);
  }
}
