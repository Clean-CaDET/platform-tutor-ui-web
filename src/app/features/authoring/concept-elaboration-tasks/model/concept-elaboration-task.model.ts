export interface KeyProposition {
  key: string;
  statement: string;
}

export interface CommonMisconception {
  key: string;
  description: string;
  correction: string;
}

export interface KeyRelation {
  key: string;
  sourceKey: string;
  targetKey: string;
  mechanism: string;
}

export interface ConceptRecord {
  canonicalDefinition: string;
  keyPropositions: KeyProposition[];
  commonMisconceptions: CommonMisconception[];
  keyRelations: KeyRelation[];
}

export interface ConceptElaborationTask {
  id?: number;
  unitId?: number;
  order: number;
  title: string;
  description: string;
  conceptRecord: ConceptRecord;
}
