export interface KnowledgeComponent {
  id?: number;
  name: string;
  code: string;
  description: string;
  order: number;
  parentId: number;
  expectedDurationInMinutes: number;
}
