import { Pipe, PipeTransform } from '@angular/core';
import { FieldOption } from '../model/field-option';

@Pipe({ name: 'fieldOptions' })
export class FieldOptionsPipe implements PipeTransform {
  transform(data: string, options: FieldOption[]) {
    return options.find(o => o.value === data).label;
  }
}