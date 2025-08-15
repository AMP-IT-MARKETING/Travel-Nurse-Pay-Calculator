
import { PayPackage, CalculationResult, OTModel, GsaRate } from '../types';

// Mock GSA per-diem data. In a real app, this would come from an API.
const MOCK_GSA_DATA: { [key: string]: GsaRate } = {
  'default': { lodging: 1000, mie: 350 }, // $50/day
  '70112': { lodging: 177 * 7, mie: 74 * 7 }, // New Orleans, LA (example rates)
  '90210': { lodging: 250 * 7, mie: 79 * 7 }, // Beverly Hills, CA (example rates)
  '10001': { lodging: 300 * 7, mie: 79 * 7 }, // New York, NY (example rates)
};

const getGsaRates = (location: string): GsaRate => {
    const zip = location.split(',')[0].trim().substring(0, 5);
    return MOCK_GSA_DATA[zip] || MOCK_GSA_DATA['default'];
};

export const calculatePackage = (inputs: PayPackage, netTaxRatePercent: number): CalculationResult => {
  const warnings: string[] = [];
  const gsaRates = getGsaRates(inputs.location);

  // 1. Stipends (Per-diems)
  const stipendHousingWeeklyCapped = Math.min(inputs.stipendHousingWeekly, gsaRates.lodging);
  if (inputs.stipendHousingWeekly > gsaRates.lodging) {
    warnings.push(`Housing stipend exceeds GSA weekly cap of $${gsaRates.lodging.toFixed(2)}.`);
  }

  const dailyMieCap = gsaRates.mie / 7;
  const mieForTravelDays = inputs.travelDays * dailyMieCap * 0.75;
  const mieForNormalDays = (7 - inputs.travelDays) * dailyMieCap;
  const weeklyMieCap = mieForTravelDays + mieForNormalDays;
  
  const stipendMieWeeklyCapped = Math.min(inputs.stipendMieWeekly, weeklyMieCap);
    if (inputs.stipendMieWeekly > weeklyMieCap) {
    warnings.push(`M&IE stipend exceeds GSA weekly cap of $${weeklyMieCap.toFixed(2)} (with travel day adjustment).`);
  }

  if (!inputs.hasTaxHome) {
      warnings.push("Without a tax home, stipends may be considered taxable income. Consult a tax professional.");
  }

  const totalStipendsWeekly = stipendHousingWeeklyCapped + stipendMieWeeklyCapped;

  // 2. Taxable Base & OT (40hr model only for V1)
  const regularHours = Math.min(inputs.weeklyHours, 40);
  const otHours = Math.max(0, inputs.weeklyHours - 40);

  // Per 29 CFR 778.115, weighted average for regular rate if multiple rates exist
  const totalShiftPay = (inputs.shiftDiff + inputs.chargeRate) * inputs.weeklyHours; // Simplified for this model
  const weightedBaseRate = inputs.taxableBaseRate + (totalShiftPay / inputs.weeklyHours);

  const taxableBaseWeekly = inputs.taxableBaseRate * regularHours;
  const otWagesWeekly = otHours * weightedBaseRate * 1.5;

  // 3. Bonuses (weeklyized)
  const totalBonuses = inputs.signOnBonus + inputs.completionBonus + inputs.travelBonus;
  const totalBonusesWeekly = inputs.contractWeeks > 0 ? totalBonuses / inputs.contractWeeks : 0;
  
  // 4. Other Taxable Pay
  const otherTaxablePay = (inputs.shiftDiff + inputs.onCallRate + inputs.callbackRate + inputs.chargeRate) * inputs.weeklyHours;

  const totalTaxableWeekly = taxableBaseWeekly + otWagesWeekly + totalBonusesWeekly + otherTaxablePay;
  
  // 5. Gross Weekly Total
  const weeklyGross = totalTaxableWeekly + totalStipendsWeekly;

  // 6. Blended Hourly
  const blendedHourly = inputs.weeklyHours > 0 ? weeklyGross / inputs.weeklyHours : 0;
  
  // 7. Risk Adjustment
  const evPenalty = (inputs.callOffRiskPercent / 100) * inputs.missedShiftPenalty;
  const riskAdjustedWeekly = weeklyGross - evPenalty;

  // 8. Net-ish Estimate
  const estimatedTaxes = totalTaxableWeekly * (netTaxRatePercent / 100);
  const netIshWeekly = weeklyGross - estimatedTaxes;

  return {
    weeklyGross,
    blendedHourly,
    netIshWeekly,
    taxableBaseWeekly,
    otWagesWeekly,
    totalBonusesWeekly,
    stipendHousingWeeklyCapped,
    stipendMieWeeklyCapped,

    totalStipendsWeekly,
    riskAdjustedWeekly,
    totalTaxableWeekly,
    warnings,
  };
};
