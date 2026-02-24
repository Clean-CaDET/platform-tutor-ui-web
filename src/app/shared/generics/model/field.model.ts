import { Crud } from './crud.model';
import { FieldOption } from './field-option';

export interface Field {
  code: string;
  type: string;
  label: string;
  required?: boolean;
  readOnly?: boolean;
  crud?: Crud;
  options?: FieldOption[];
}
