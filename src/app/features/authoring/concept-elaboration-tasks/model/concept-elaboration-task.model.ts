export interface Misconception {
  description: string;
  correction: string;
}

export interface KeyProposition {
  key: string;
  statement: string;
  hint?: string | null;
  misconception?: Misconception | null;
}

export interface ConceptRecord {
  canonicalDefinition: string;
  keyPropositions: KeyProposition[];
}

export interface ConceptElaborationTask {
  id?: number;
  unitId?: number;
  order: number;
  title: string;
  description: string;
  conceptRecord: ConceptRecord;
}
