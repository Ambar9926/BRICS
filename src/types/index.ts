export type Country = 'India' | 'Brazil' | 'Russia' | 'China' | 'South Africa';

export type CountryCode = 'IN' | 'BR' | 'RU' | 'CN' | 'ZA';

export type Category =
  | 'Transport'
  | 'Water'
  | 'Energy'
  | 'Sanitation'
  | 'Digital'
  | 'Housing'
  | 'Healthcare';

export type TicketStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Budget Allocated'
  | 'Resolved';

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  country: Country;
  countryCode: CountryCode;
  city: string;
  area: string;
  category: Category;
  status: TicketStatus;
  priority: Priority;
  votes: number;
  citizenName: string;
  createdAt: string;
  photoUrl?: string;
  assignedTeam?: string;
  aiDamageAssessment?: DamageAssessment;
}

export interface DamageAssessment {
  severity: 'None' | 'Minor' | 'Moderate' | 'Severe' | 'Critical';
  confidence: number;
  description: string;
  detectedIssues: string[];
  estimatedRepairCost: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  language?: string;
}

export interface Hotspot {
  id: string;
  country: Country;
  countryCode: CountryCode;
  city: string;
  name: string;
  x: number;
  y: number;
  intensity: number;
  totalIssues: number;
  resolvedIssues: number;
  topCategory: Category;
  avgResponseDays: number;
  citizenImpact: number;
}

export interface RegionalIssue {
  id: string;
  title: string;
  category: Category;
  votes: number;
  status: TicketStatus;
}

export interface FeedbackLog {
  id: string;
  citizenName: string;
  message: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface BudgetAllocation {
  category: Category;
  percentage: number;
  amount: number;
  reasoning: string;
  impactEstimate: string;
}

export interface PredictiveAlert {
  id: string;
  country: Country;
  city: string;
  infrastructure: string;
  riskLevel: 'Elevated' | 'High' | 'Severe';
  failureProbability: number;
  estimatedTimeframe: string;
  factors: string[];
  affectedPopulation: number;
  recommendedAction: string;
  category: Category;
}

export interface ResponseTeam {
  id: string;
  name: string;
  specialization: Category;
  country: Country;
  status: 'Available' | 'Deployed' | 'On Leave';
  activeTickets: number;
}

export type TabId =
  | 'citizen'
  | 'government'
  | 'gis'
  | 'simulator'
  | 'alerts'
  | 'admin';
