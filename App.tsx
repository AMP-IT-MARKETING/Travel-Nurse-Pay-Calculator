import React, { useState, useMemo, useCallback } from 'react';
import { PayPackage, CalculationResult, OTModel } from './types';
import { calculatePackage } from './services/calculationService';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Switch } from './components/Switch';
import { Tooltip } from './components/Tooltip';
import { CalculatorIcon } from './components/icons/CalculatorIcon';
import { InfoIcon } from './components/icons/InfoIcon';
import { ChevronDownIcon } from './components/icons/ChevronDownIcon';

const initialPackageState: PayPackage = {
  location: '70112',
  contractWeeks: 13,
  weeklyHours: 36,
  taxableBaseRate: 23.70,
  stipendHousingWeekly: 1000,
  stipendMieWeekly: 246,
  otModel: OTModel.FORTY_HR,
  shiftDiff: 0,
  onCallRate: 0,
  callbackRate: 0,
  chargeRate: 0,
  signOnBonus: 0,
  completionBonus: 0,
  travelBonus: 0,
  guaranteedHours: 36,
  missedShiftPenalty: 0,
  callOffRiskPercent: 0,
  travelDays: 0,
  hasTaxHome: true,
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const App: React.FC = () => {
  const [inputs, setInputs] = useState<PayPackage>(initialPackageState);
  const [taxRate, setTaxRate] = useState(22);
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value,
    }));
  }, []);
  
  const handleSwitchChange = useCallback((name: string, checked: boolean) => {
    setInputs(prev => ({ ...prev, [name]: checked }));
  }, []);
  
  const handleSelectChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setInputs(prev => ({...prev, [name]: value}));
  }, []);

  const results: CalculationResult | null = useMemo(() => {
    return calculatePackage(inputs, taxRate);
  }, [inputs, taxRate]);

  return (
    <div className="min-h-screen bg-gray-50 text-[#3E4E56]">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-[#00AAA1] p-2 rounded-lg">
              <CalculatorIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#137D79]" style={{fontFamily: "'Source Sans 3', sans-serif"}}>Advantage Medical Professionals</h1>
              <p className="text-sm text-gray-500" style={{fontFamily: "'Source Sans 3', sans-serif"}}>Pay Package Calculator</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Clinician</span>
            <Switch checked={isRecruiterMode} onChange={(checked) => setIsRecruiterMode(checked)} />
            <span className={`text-sm font-medium ${isRecruiterMode ? 'text-[#00AAA1]' : ''}`}>Recruiter</span>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Form Column */}
          <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-[#3E4E56] mb-6 border-b pb-4">Create Pay Package</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Location (ZIP or City, ST)" name="location" value={inputs.location} onChange={handleInputChange} tooltip="Drives GSA per-diem rate lookup for stipend caps." />
              <Input label="Contract Length (weeks)" name="contractWeeks" type="number" value={inputs.contractWeeks} onChange={handleInputChange} min={1} />
              <Input label="Weekly Hours" name="weeklyHours" type="number" value={inputs.weeklyHours} onChange={handleInputChange} min={1} />
              <Input label="Taxable Base Rate ($/hr)" name="taxableBaseRate" type="number" value={inputs.taxableBaseRate} onChange={handleInputChange} step={0.01} />
              <Input label="Weekly Housing Stipend ($)" name="stipendHousingWeekly" type="number" value={inputs.stipendHousingWeekly} onChange={handleInputChange} tooltip="Non-taxable reimbursement for lodging. Capped at GSA rates." />
              <Input label="Weekly M&IE Stipend ($)" name="stipendMieWeekly" type="number" value={inputs.stipendMieWeekly} onChange={handleInputChange} tooltip="Non-taxable reimbursement for Meals & Incidental Expenses. Capped at GSA rates."/>
            </div>

             <div className="mt-6 flex items-center space-x-4">
                <label htmlFor="hasTaxHome" className="font-semibold flex items-center">
                  I have a qualifying tax home
                  <Tooltip text="To receive tax-free stipends, the IRS requires you to maintain a 'tax home' where you incur duplicate living expenses while on assignment. See IRS Pub 463." />
                </label>
                <Switch name="hasTaxHome" checked={inputs.hasTaxHome} onChange={(checked) => handleSwitchChange('hasTaxHome', checked)} />
              </div>

            <div className="mt-8">
                <Button variant="secondary" onClick={() => setShowAdvanced(!showAdvanced)} className="w-full flex justify-center items-center">
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                    <ChevronDownIcon className={`w-5 h-5 ml-2 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </Button>
            </div>

            {showAdvanced && (
                <div className="mt-6 pt-6 border-t animate-fade-in">
                    <h3 className="text-xl font-bold text-[#3E4E56] mb-4">Bonuses & Differentials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Sign-On Bonus ($)" name="signOnBonus" type="number" value={inputs.signOnBonus} onChange={handleInputChange} />
                        <Input label="Completion Bonus ($)" name="completionBonus" type="number" value={inputs.completionBonus} onChange={handleInputChange} />
                        <Input label="Travel Bonus ($)" name="travelBonus" type="number" value={inputs.travelBonus} onChange={handleInputChange} />
                        <Input label="Shift Diff ($/hr)" name="shiftDiff" type="number" value={inputs.shiftDiff} onChange={handleInputChange} step={0.01} />
                    </div>
                    <h3 className="text-xl font-bold text-[#3E4E56] mt-8 mb-4">Risk & Adjustments</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First/Last Travel Days</label>
                            <select name="travelDays" value={inputs.travelDays} onChange={handleSelectChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00AAA1] focus:border-[#00AAA1]">
                                <option value={0}>0 Days</option>
                                <option value={2}>2 Days</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Applies 75% M&IE rate on these days per GSA rules.</p>
                        </div>
                        <Input label="Call-off Risk (%)" name="callOffRiskPercent" type="number" value={inputs.callOffRiskPercent} onChange={handleInputChange} tooltip="Estimated probability of a shift being called off."/>
                        <Input label="Missed Shift Penalty ($)" name="missedShiftPenalty" type="number" value={inputs.missedShiftPenalty} onChange={handleInputChange} tooltip="Penalty amount if a guaranteed shift is called off."/>
                    </div>
                </div>
            )}
             {isRecruiterMode && (
                <div className="mt-6 pt-6 border-t animate-fade-in border-yellow-400 bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-[#3E4E56] mb-4">Recruiter Tools</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <Input label="Guaranteed Hours" name="guaranteedHours" type="number" value={inputs.guaranteedHours} onChange={handleInputChange} />
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Facility OT Basis</label>
                             <select name="otModel" value={inputs.otModel} onChange={handleSelectChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#00AAA1] focus:border-[#00AAA1]">
                                <option value={OTModel.FORTY_HR}>Standard 40-hr Week</option>
                                <option value={OTModel.EIGHT_EIGHTY}>8/80 Rule (Healthcare)</option>
                            </select>
                         </div>
                     </div>
                    <div className="mt-4 p-3 bg-ocean-lightest rounded">
                        <h4 className="font-bold text-ocean-dark">Compliance Notes</h4>
                        <ul className="list-disc list-inside text-sm text-ocean space-y-1 mt-2">
                            <li>Ensure pay split meets taxable minimums.</li>
                            <li>Do not include facility names in exported PDFs.</li>
                            <li>Remind clinician of licensure/NLC requirements.</li>
                        </ul>
                    </div>
                </div>
            )}
          </div>

          {/* Results Column */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-[#3E4E56] mb-0 lg:mb-2">Package Summary</h2>
            {results && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card title="Weekly Gross" value={formatCurrency(results.weeklyGross)} tooltip="Total pay before any deductions, including taxable wages and non-taxable stipends." />
                  <Card title="Blended Hourly" value={formatCurrency(results.blendedHourly)} tooltip="Your gross weekly pay divided by total hours worked. Combines taxable and non-taxable pay into an hourly rate." primary/>
                  <Card title="Est. Weekly Take-Home" value={formatCurrency(results.netIshWeekly)} tooltip="An estimate of your weekly pay after taxes on the taxable portion. Adjust the tax rate slider for a more personalized estimate." />
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
                  <h3 className="font-bold text-lg">Estimated Take-Home Adjustment</h3>
                  <div>
                    <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">Assumed Tax Rate: {taxRate}%</label>
                    <input id="taxRate" type="range" min="10" max="40" value={taxRate} onChange={(e) => setTaxRate(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00AAA1]" />
                    <p className="text-xs text-gray-500 mt-1">Adjust slider to estimate withholding (Fed+State+FICA). This is not tax advice.</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="font-bold text-lg mb-4">Weekly Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-semibold text-gray-600">Taxable Base Pay</span>
                      <span className="font-mono">{formatCurrency(results.taxableBaseWeekly)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-semibold text-gray-600">Overtime Pay</span>
                      <span className="font-mono">{formatCurrency(results.otWagesWeekly)}</span>
                    </div>
                     <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-semibold text-gray-600">Weeklyized Bonuses</span>
                      <span className="font-mono">{formatCurrency(results.totalBonusesWeekly)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b text-[#00AAA1]">
                      <span className="font-bold">Total Taxable</span>
                      <span className="font-mono font-bold">{formatCurrency(results.totalTaxableWeekly)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 pb-2 border-b">
                      <span className="font-semibold text-gray-600">Housing Stipend</span>
                      <span className="font-mono">{formatCurrency(results.stipendHousingWeeklyCapped)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-semibold text-gray-600">M&IE Stipend</span>
                      <span className="font-mono">{formatCurrency(results.stipendMieWeeklyCapped)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b text-[#137D79]">
                      <span className="font-bold">Total Non-Taxable</span>
                      <span className="font-mono font-bold">{formatCurrency(results.totalStipendsWeekly)}</span>
                    </div>
                     {showAdvanced && inputs.callOffRiskPercent > 0 && (
                        <div className="flex justify-between items-center pt-4 text-orange-600 bg-orange-50 p-2 rounded-md">
                            <span className="font-bold">Risk-Adjusted Gross</span>
                            <span className="font-mono font-bold">{formatCurrency(results.riskAdjustedWeekly)}</span>
                        </div>
                    )}
                  </div>
                </div>
                
                {results.warnings.length > 0 && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow" role="alert">
                        <p className="font-bold">Heads up!</p>
                        <ul className="mt-2 list-disc list-inside">
                            {results.warnings.map((warning, i) => <li key={i}>{warning}</li>)}
                        </ul>
                    </div>
                )}
              </>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
