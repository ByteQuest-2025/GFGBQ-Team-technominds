export type RiskLevel = 'low' | 'medium' | 'high';

export interface ScamIndicator {
  id: string;
  type: 'impersonation' | 'urgency' | 'emotional' | 'authority' | 'otp_request' | 'money_request' | 'voice_pattern';
  label: string;
  description: string;
  severity: RiskLevel;
  detected: boolean;
  confidence: number;
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  riskScore: number;
  indicators: ScamIndicator[];
  guidance: string[];
  timestamp: Date;
}

export interface CallRecord {
  id: string;
  date: Date;
  duration: number;
  riskLevel: RiskLevel;
  riskScore: number;
  indicators: ScamIndicator[];
  audioUrl?: string;
}

export interface AppState {
  isRecording: boolean;
  isAnalyzing: boolean;
  currentAnalysis: AnalysisResult | null;
  callHistory: CallRecord[];
}
