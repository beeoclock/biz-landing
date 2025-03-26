export interface TariffApiResponse {
  items: TariffPlanDto[];
  total: number;
}
export interface TariffPlanDto {
  _id: string;
  createdAt: string;
  updatedAt: string;
  state: string;
  stateHistory: StateHistoryItem[];
  object: string;
  type: string;
  prices: TariffPrice[];
  isPerSpecialist: boolean;
  specialistLimit: number | null;
  pluginAttachment: PluginAttachment;
  features: string[];
  trialInfo: TrialInfo;
}

export interface StateHistoryItem {
  state: string;
  setAt: string;
}

export interface TariffPrice {
  country?: string;
  region: string;
  currency: string;
  values: PriceValue[];
  languageVersions: LanguageVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface PriceValue {
  billingCycle: 'monthly' | 'yearly';
  beforeDiscount: number;
  afterDiscount: number;
  discountPercentage: number;
}

export interface LanguageVersion {
  title: string;
  description: string;
  language: string;
}

export interface PluginAttachment {
  includeAll: boolean;
  excludeAll: boolean;
  includeList: string[];
  excludeList: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TrialInfo {
  days: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}
