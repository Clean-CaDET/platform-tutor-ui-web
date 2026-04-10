export interface KeyProposition {
  id?: number;
  statement: string;
  level: string;
}

export interface BoundaryCondition {
  id?: number;
  statement: string;
  level: string;
}

export interface CommonMisconception {
  id?: number;
  description: string;
  correction: string;
}

export interface KeyRelation {
  id?: number;
  sourceKeyPropositionId?: number;
  targetKeyPropositionId?: number;
  sourceKeyPropositionIndex?: number;
  targetKeyPropositionIndex?: number;
  mechanism: string;
  level: string;
}

export interface ConceptRecord {
  id?: number;
  courseId?: number;
  title: string;
  canonicalDefinition: string;
  keyPropositions: KeyProposition[];
  boundaryConditions: BoundaryCondition[];
  commonMisconceptions: CommonMisconception[];
  keyRelations: KeyRelation[];
}
