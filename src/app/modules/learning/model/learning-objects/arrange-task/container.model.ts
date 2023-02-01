import { Element } from './element.model';

export interface Container {
  id: number;
  title: string;
  elements: Element[];
}
