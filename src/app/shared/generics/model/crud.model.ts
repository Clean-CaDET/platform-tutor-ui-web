export interface Crud {
  create?: boolean;
  clone?: boolean;
  update?: boolean;
  archive?: boolean;
  delete: boolean;
  filter?: boolean;
  bulkCreate?: boolean;
  bulkCreateDialogComponent?: any;
}
