
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

// Interface for the raw job object from the Salesforce API
export interface ApiJob {
    Job_Name: string;
    Job_Speciality: string;
    Job_City: string;
    Job_State: string;
    Job_Hours_Per_Week: string;
    job_Weekly_pre_tax: string;
    job_Weekly_Stipend_Amount: number;
    Job_Pay_Rate: string;
    // Add any other fields you might need from the API response
}

// Cleaned and structured Job object for use within the application
export interface Job {
  jobTitle: string;
  specialty: string;
  city: string;
  state: string;
  contractWeeks: string;
  weeklyHours: string;
  weeklyGrossPay: number;
  weeklyStipend: number;
  payPackage: {
    taxableRate: number;
  };
}
