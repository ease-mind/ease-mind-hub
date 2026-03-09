export interface CognitiveSettingsEntity {
  complexity: 'simple' | 'complete';
  contrast: 'low' | 'normal' | 'high';
  spacing: number;
  fontSize: number;
  alertsEnabled?: boolean;
  alertIntervalMinutes?: number;
}
