import {Crud} from './crud';

export interface Field {
  code: string;
  type: string;
  label: string;
  required?: boolean;
  crud?: Crud;
}
