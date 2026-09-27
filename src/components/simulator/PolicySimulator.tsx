import { useState, useMemo, useEffect } from 'react';
import {
  DollarSign,
  Sparkles,
  Loader2,
  TrendingUp,
  Lightbulb,
  PieChart,
} from 'lucide-react';
import { COUNTRIES } from '@/data/mockData';
import { getSmartBudgetAllocation, isGeminiLive, type BudgetSuggestion } from '@/hooks/useGemini';
import type { Country, Category } from '@/types';

const BUDGET_CATEGORIES: Category[] = [
  'Transport',
  'Water',
  'Energy',
  'Sanitation',
  'Digital',
  'Housing',
  'Healthcare',
];

const CATEGORY_COLORS: Record<Category, string> = {
  Transport: '#3282fc',
  Water: '#06b6d4',
  Energy: '#f59e0b',
  Sanitation: '#10b981',
  Digital: '#8b5cf6',
  Housing: '#ec4899',
  Healthcare: '#ef4444',
};

function formatBudget(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

export function PolicySimulator() {
  const [budget, setBudget] = useState(500_000_000);
  const [country, setCountry] = useState<Country>('India');
  const [allocations, setAllocations] = useState<Record<Category, number>>({
    Transport: 25,
    Water: 20,
    Energy: 15,
    Sanitation: 10,
    Digital: 10,
    Housing: 10,
    Healthcare: 10,
  });
  const [suggestions, setSuggestions] = useState<BudgetSuggestion[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  const totalPercentage = useMemo(
    () => Object.values(allocations).reduce((a, b) => a + b, 0),
    [allocations],
  );

  const allocationAmounts = useMemo(() => {
    const result: Record<Category, number> = {} as Record<Category, number>;
    (Object.keys(allocations) as Category[]).forEach((cat) => {
      result[cat] = Math.round((allocations[cat] / 100) * budget);
    });
    return result;
  }, [allocations, budget]);

  const updateAllocation = (cat: Category, value: number) => {
    setAllocations((prev) => ({ ...prev, [cat]: value }));
  };

  // Generate mock priority data based on current allocations for AI call
  const priorityData = useMemo(() => {
    const data: Record<string, number> = {};
    BUDGET_CATEGORIES.forEach((cat) => {
      data[cat] = allocations[cat] + Math.floor(Math.random() * 20);
    });
    return data;
  }, [allocations]);

  const runAISuggestion = async () => {
    setLoadingAI(true);
    try {
      const result = await getSmartBudgetAllocation(budget, country, priorityData);
      setSuggestions(result);
    } catch {
      // Fallback
      setSuggestions(
        BUDGET_CATEGORIES.slice(0, 5).map((cat, idx) => ({
          category: cat,
          percentage: [30, 25, 20, 15, 10][idx],
          reasoning: `${cat} requires urgent attention based on citizen complaint volume and infrastructure age analysis.`,
          impactEstimate: `Estimated to impact ${(idx + 1) * 50000} citizens.`,
        })),
      );
    } finally {
      setLoadingAI(false);
    }
  };

  // Auto-generate suggestions on first load
  useEffect(() => {
    runAISuggestion();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero */}
      <div className="mb-8">
        <span className="badge bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300 mb-3">
          Policy Simulator & AI Budget Allocator
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
          Smart Infrastructure Investment
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
          Simulate budget allocations across infrastructure categories and get AI-powered recommendations for optimal fund distribution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Controls */}
        <div className="lg:col-span-1 space-y-4">
          {/* Budget Slider */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-success-600 dark:text-success-400" />
              <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white">Total Budget</h3>
            </div>
            <p className="font-display text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
              {formatBudget(budget)}
            </p>
            <input
              type="range"
              min={100_000_000}
              max={5_000_000_000}
              step={50_000_000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 appearance-none cursor-pointer accent-primary-600"
            />
            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-2">
              <span>$100M</span>
              <span>$5B</span>
            </div>
          </div>

          {/* Country Selector */}
          <div className="card p-5">
            <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white mb-3">Target Region</h3>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value as Country)}
              className="input-field"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Allocation Sliders */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white">Manual Allocation</h3>
              <span className={`badge ${totalPercentage === 100 ? 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300' : 'bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-300'}`}>
                {totalPercentage}%
              </span>
            </div>
            <div className="space-y-3">
              {BUDGET_CATEGORIES.map((cat) => (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
                      {cat}
                    </span>
                    <span className="text-xs font-bold text-gray-900 dark:text-white tabular-nums">
                      {allocations[cat]}% · {formatBudget(allocationAmounts[cat])}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={allocations[cat]}
                    onChange={(e) => updateAllocation(cat, Number(e.target.value))}
                    className="w-full h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 appearance-none cursor-pointer"
                    style={{ accentColor: CATEGORY_COLORS[cat] }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Visualizations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pie Chart */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white">Budget Distribution</h3>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <BudgetPieChart allocations={allocations} amounts={allocationAmounts} />
              <div className="flex-1 space-y-2 w-full">
                {BUDGET_CATEGORIES.map((cat) => (
                  <div key={cat} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{cat}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">
                      {formatBudget(allocationAmounts[cat])}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white">Allocation Comparison</h3>
            </div>
            <BudgetBarChart allocations={allocations} amounts={allocationAmounts} budget={budget} />
          </div>

          {/* AI Smart Budget Allocator */}
          <div className="card p-6 border-2 border-primary-200 dark:border-primary-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white">AI Smart Budget Allocator</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Optimal fund distribution recommendation</p>
                </div>
              </div>
              <button
                onClick={runAISuggestion}
                disabled={loadingAI}
                className="btn-primary text-xs"
              >
                {loadingAI ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing...</>
                ) : (
                  <><Sparkles className="h-3.5 w-3.5" /> Regenerate</>
                )}
              </button>
            </div>

            {!isGeminiLive() && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                Running in demo mode with AI-simulated recommendations. Add your Gemini API key for live analysis.
              </p>
            )}

            <div className="space-y-3">
              {loadingAI ? (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 rounded-xl animate-shimmer-bg" />
                ))
              ) : (
                suggestions.map((sug, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 animate-slide-up"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[sug.category as Category] || '#gray' }} />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{sug.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                          {sug.percentage}%
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {formatBudget((sug.percentage / 100) * budget)}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${sug.percentage}%`,
                          backgroundColor: CATEGORY_COLORS[sug.category as Category] || '#gray',
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{sug.reasoning}</p>
                    <div className="flex items-center gap-1.5 text-xs text-success-600 dark:text-success-400">
                      <Lightbulb className="h-3 w-3" /> {sug.impactEstimate}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pie Chart Component (SVG) ───

function BudgetPieChart({
  allocations,
  amounts,
}: {
  allocations: Record<Category, number>;
  amounts: Record<Category, number>;
}) {
  const size = 180;
  const center = size / 2;
  const radius = 70;
  const strokeWidth = 30;

  const entries = BUDGET_CATEGORIES.map((cat) => ({
    cat,
    value: allocations[cat],
    amount: amounts[cat],
  })).filter((e) => e.value > 0);

  const total = entries.reduce((sum, e) => sum + e.value, 0) || 1;
  let cumulative = 0;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-100 dark:text-gray-800"
      />
      {entries.map((entry, idx) => {
        const fraction = entry.value / total;
        const dash = fraction * circumference;
        const offset = -cumulative * circumference;
        cumulative += fraction;
        return (
          <circle
            key={idx}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={CATEGORY_COLORS[entry.cat]}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${center} ${center})`}
            className="transition-all duration-700"
          />
        );
      })}
      <text
        x={center}
        y={center - 5}
        textAnchor="middle"
        className="fill-gray-900 dark:fill-white font-bold"
        style={{ fontSize: 14 }}
      >
        {entries.length}
      </text>
      <text
        x={center}
        y={center + 12}
        textAnchor="middle"
        className="fill-gray-400 dark:fill-gray-500"
        style={{ fontSize: 9 }}
      >
        Categories
      </text>
    </svg>
  );
}

// ─── Bar Chart Component ───

function BudgetBarChart({
  allocations,
  amounts,
  budget,
}: {
  allocations: Record<Category, number>;
  amounts: Record<Category, number>;
  budget: number;
}) {
  const maxAmount = budget * 0.6;

  return (
    <div className="space-y-3">
      {BUDGET_CATEGORIES.map((cat) => {
        const amount = amounts[cat];
        const widthPct = (amount / maxAmount) * 100;
        return (
          <div key={cat}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{cat}</span>
              <span className="text-xs font-bold text-gray-900 dark:text-white tabular-nums">
                {formatBudget(amount)} ({allocations[cat]}%)
              </span>
            </div>
            <div className="h-6 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-lg transition-all duration-700 flex items-center justify-end px-2"
                style={{
                  width: `${Math.min(widthPct, 100)}%`,
                  backgroundColor: CATEGORY_COLORS[cat],
                  minWidth: amount > 0 ? '8px' : '0',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
