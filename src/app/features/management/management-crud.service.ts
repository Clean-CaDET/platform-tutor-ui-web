import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/generics/generic-table/crud.service';
import { Entity } from '../../shared/generics/model/entity.model';

@Injectable()
export class ManagementCrudService extends CrudService<Entity> {}
