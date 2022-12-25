import { Entity } from "src/app/shared/generics/model/entity.model";

export interface Course extends Entity {
  code: string;
  name: string;
  description: string;
  isArchived: boolean;
}
