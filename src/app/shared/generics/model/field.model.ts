import {Crud} from './crud.model';

export interface Field {
  code: string;
  type: string;
  label: string;
  required?: boolean;
  crud?: Crud;
}
