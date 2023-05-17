import {Crud} from './crud.model';
import { FieldOption } from './field-option';

export interface Field {
  code: string;
  type: string;
  label: string;
  required?: boolean;
  crud?: Crud;
  options?: FieldOption[];
}
