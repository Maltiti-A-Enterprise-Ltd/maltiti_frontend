/**
 * Shape of the payload produced by the Maltiti Ecosystem knowledge model.
 * Mirrors tools/lib/web-export.mjs in that repository. If the two drift, the map breaks loudly
 * rather than quietly, because everything here is required.
 */

export type TruthStatus =
  | 'CONFIRMED'
  | 'PARTIALLY_CONFIRMED'
  | 'INFERRED'
  | 'UNVERIFIED'
  | 'UNKNOWN'
  | 'HISTORICAL'
  | 'PLANNED'
  | 'DISPUTED';

export interface Attribute {
  key: string;
  label: string | null;
  value: unknown;
  unit: string | null;
  status: TruthStatus;
  confidence: number;
  sources: string[];
  asOf: string;
  volatility: string | null;
  notes: string | null;
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  subtype: string | null;
  status: TruthStatus;
  confidence: number;
  granularity: 'instance' | 'class';
  provisional: boolean;
  tags: string[];
  roles: string[];
  aliases: string[];
  summary: string;
  notes: string | null;
  cluster: string;
  degree: number;
  color: string;
  x: number;
  y: number;
  x3: number;
  y3: number;
  z3: number;
  lastReviewed: string;
  reviewDue: string | null;
  attributes: Attribute[];
  sources: string[];
  gaps: string[];
  questions: string[];
  assumptions: string[];
  contradictions: string[];
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  label: string | null;
  status: TruthStatus;
  confidence: number;
  domain: string;
  notes: string | null;
  sources: string[];
  gaps: string[];
  questions: string[];
  assumptions: string[];
}

export interface StatusStyle {
  marker: string;
  dash: boolean;
  dim: number;
  ring: string | null;
  label: string;
}

export interface ViewPreset {
  id: string;
  title: string;
  description: string;
  audience: string;
  nodeIds: string[];
  relationshipTypes: string[];
}

export interface SourceRecord {
  id: string;
  title: string;
  type: string;
  origin: string;
  dateOfInformation: string;
  reliability: string;
  credibility: number;
  limitations: string[];
  usageRule: string | null;
}

export interface GapRecord {
  id: string;
  priority: string;
  kind: string;
  title: string;
  description: string;
  status: string;
  questions: string[];
}

export interface AssumptionRecord {
  id: string;
  statement: string;
  status: string;
  confidence: number;
  basis: string;
  impactIfWrong: string;
  falsifiedBy: string;
}

export interface QuestionRecord {
  id: string;
  priority: string;
  batch: string;
  question: string;
  whyItMatters: string;
  askOf: string;
  status: string;
}

export interface DomainStat {
  entities: number;
  relationships: number;
  meanConfidence: number | null;
  openGaps: number;
}

export interface EcosystemGraph {
  model: string;
  generated: string;
  schemaVersion: string;
  warning: string;
  stats: {
    entities: number;
    relationships: number;
    provisional: number;
    classPlaceholders: number;
    sources: number;
    openGaps: number;
    openQuestions: number;
    openContradictions: number;
    meanEntityConfidence: number;
    meanRelationshipConfidence: number;
    entityStatus: Record<string, number>;
    domains: Record<string, DomainStat>;
  };
  meta: {
    statusStyle: Record<TruthStatus, StatusStyle>;
    statusDefinition: Record<string, string>;
    typeColor: Record<string, string>;
    typeLabel: Record<string, string>;
    typeDefinition: Record<string, string>;
    domains: Record<string, string>;
    relationshipDefinition: Record<string, string>;
  };
  governance: {
    sources: Record<string, SourceRecord>;
    gaps: Record<string, GapRecord>;
    assumptions: Record<string, AssumptionRecord>;
    questions: Record<string, QuestionRecord>;
  };
  views: ViewPreset[];
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/** What the renderers need to know about the current interaction state. */
export interface MapViewState {
  visibleNodeIds: Set<string>;
  selectedId: string | null;
  hoveredId: string | null;
  neighbourIds: Set<string>;
  showLabels: boolean;
}
