export interface SymptomEntity {
  id: string;
  label: string;
  category: 'communication' | 'physical' | 'stereotypies';
  description?: string;
}

export interface SymptomCategoryEntity {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface UserSymptomRecordEntity {
  userId: string;
  selectedSymptoms: string[];
  temperature: number;
  level: string;
  timestamp: Date;
  categoryCount: {
    communication: number;
    physical: number;
    stereotypies: number;
  };
}
