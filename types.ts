
export interface CaseFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'video' | 'audio' | 'text';
  uploadDate: string;
  summary?: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface CaseDocument {
  id: string;
  name: string;
  type: string;
  content: string; // The extracted text acting as the source of truth
  uploadDate: Date;
}

export interface CaseEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'filing' | 'hearing' | 'deadline' | 'discovery';
  status: 'pending' | 'completed' | 'overdue';
}

export interface EvidenceEvent extends CaseEvent {
  sourceDocumentId?: string;
  sourceDocumentName?: string;
  isVerified: boolean;
  confidenceScore?: number;
  category: 'procedural' | 'evidence';
}

export interface LegalRisk {
  category: 'Procedural' | 'Evidentiary' | 'Factual' | 'Strategic';
  description: string;
  severity: number; // 1-10
  mitigation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
  citations?: string[];
}

export enum LegalTab {
  DASHBOARD = 'dashboard',
  EVIDENCE = 'evidence',
  STRATEGY = 'strategy',
  RESEARCH = 'research',
  CHAT = 'chat'
}

export interface CaseNodeData {
  id: string;
  type: 'party' | 'evidence' | 'event';
  label: string;
  x: number;
  y: number;
}

export interface CaseLinkData {
  s: string;
  t: string;
  l: string;
}

export interface CaseData {
  events: CaseEvent[];
  risks: LegalRisk[];
  mapNodes: CaseNodeData[];
  mapLinks: CaseLinkData[];
}

export interface FlaggedCitation {
  citation: string;
  reason: string;
}

export interface VerificationSource {
  web?: { uri?: string; title?: string };
  title?: string;
  url?: string;
}

export interface VerificationReport {
  id: string;
  overall_flag: boolean;
  flagged_citations: FlaggedCitation[];
  verdictText: string;
  sources: VerificationSource[];
}

// === WAR GAME REPORT TYPES ===
export interface ElementalStatus {
  claim: string;
  status: 'Strong' | 'Weak' | 'Fatal';
  missing_elements: string[];
}

export interface AdversarialMove {
  move: string;
  probability: 'High' | 'Medium' | 'Low';
  counter_tactic: string;
}

export interface StrategicStep {
  step: number;
  action: string;
  goal: string;
}

export interface WarGameReport {
  executive_summary: string;
  elemental_analysis: ElementalStatus[];
  adversarial_forecast: AdversarialMove[];
  strategic_sequence: StrategicStep[];
  narrative_theme: string;
  win_probability: number;
}

export interface KeyDate {
  date: string;
  event: string;
  is_deadline: boolean;
}

export interface DocumentParties {
  plaintiff: string;
  defendant: string;
  judge: string;
}

export interface RiskFactor {
  severity: 'Low' | 'Medium' | 'High';
  issue: string;
}

export interface DocumentAnalysis {
  document_type: string;
  summary: string;
  key_dates: KeyDate[];
  parties: DocumentParties;
  risk_factors: RiskFactor[];
}

export type WorkspaceRole = 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface WorkspaceUser {
  id: string;
  email: string;
  name?: string | null;
  role: WorkspaceRole;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}
