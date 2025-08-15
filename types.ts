
export enum OTModel {
  FORTY_HR = '40hr',
  EIGHT_EIGHTY = '8/80',
}

export interface PayPackage {
  location: string;
  contractWeeks: number;
  weeklyHours: number;
  taxableBaseRate: number;
  stipendHousingWeekly: number;
  stipendMieWeekly: number;

  // Advanced options
  otModel: OTModel;
  shiftDiff: number;
  onCallRate: number;
  callbackRate: number;
  chargeRate: number;
  signOnBonus: number;
  completionBonus: number;
  travelBonus: number;
  guaranteedHours: number;
  missedShiftPenalty: number;
  callOffRiskPercent: number;
  travelDays: 0 | 2;
  hasTaxHome: boolean;
}

export interface CalculationResult {
  weeklyGross: number;
  blendedHourly: number;
  netIshWeekly: number;
  taxableBaseWeekly: number;
  otWagesWeekly: number;
  totalBonusesWeekly: number;
  stipendHousingWeeklyCapped: number;
  stipendMieWeeklyCapped: number;
  totalStipendsWeekly: number;
  riskAdjustedWeekly: number;
  totalTaxableWeekly: number;
  warnings: string[];
}

export interface GsaRate {
    lodging: number;
    mie: number;
}
