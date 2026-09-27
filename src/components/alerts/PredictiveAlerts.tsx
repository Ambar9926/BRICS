import { useState } from 'react';
import {
  AlertTriangle,
  TrendingDown,
  Clock,
  Users,
  Activity,
  ChevronDown,
  ShieldAlert,
  Lightbulb,
  Filter,
} from 'lucide-react';
import { mockAlerts } from '@/data/mockData';
import { CountryFlag, CategoryIcon } from '@/components/shared/Badges';
import type { PredictiveAlert, Country } from '@/types';
import { COUNTRIES } from '@/data/mockData';

const RISK_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Elevated: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-800',
    dot: 'bg-yellow-500',
  },
  High: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800',
    dot: 'bg-orange-500',
  },
  Severe: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
  },
};

export function PredictiveAlerts() {
  const [countryFilter, setCountryFilter] = useState<Country | 'all'>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = mockAlerts.filter((a) => {
    if (countryFilter !== 'all' && a.country !== countryFilter) return false;
    if (riskFilter !== 'all' && a.riskLevel !== riskFilter) return false;
    return true;
  });

  const stats = {
    total: mockAlerts.length,
    severe: mockAlerts.filter((a) => a.riskLevel === 'Severe').length,
    high: mockAlerts.filter((a) => a.riskLevel === 'High').length,
    population: mockAlerts.reduce((sum, a) => sum + a.affectedPopulation, 0),
  };

  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero */}
      <div className="mb-8">
        <span className="badge bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 mb-3">
          <ShieldAlert className="h-3 w-3" /> Predictive Failure Alerts
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
          AI-Powered Risk Forecasting
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
          Machine learning models predict infrastructure failures before they happen, enabling proactive intervention across BRICS nations.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Active Alerts</span>
          </div>
          <p className="font-display text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Severe Risk</span>
          </div>
          <p className="font-display text-2xl font-bold text-red-600 dark:text-red-400">{stats.severe}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-xs text-gray-500 dark:text-gray-400">High Risk</span>
          </div>
          <p className="font-display text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.high}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Population at Risk</span>
          </div>
          <p className="font-display text-2xl font-bold text-gray-900 dark:text-white">{(stats.population / 1000000).toFixed(1)}M</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Filter className="h-4 w-4 text-gray-400" />
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value as Country | 'all')}
          className="input-field text-sm w-auto"
        >
          <option value="all">All Countries</option>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.name}>{c.name}</option>
          ))}
        </select>
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="input-field text-sm w-auto"
        >
          <option value="all">All Risk Levels</option>
          <option value="Severe">Severe</option>
          <option value="High">High</option>
          <option value="Elevated">Elevated</option>
        </select>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
            No alerts match your filters.
          </div>
        ) : (
          filtered.map((alert, idx) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              expanded={expandedId === alert.id}
              onToggle={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
              delay={idx * 60}
            />
          ))
        )}
      </div>
    </div>
  );
}

function AlertCard({
  alert,
  expanded,
  onToggle,
  delay,
}: {
  alert: PredictiveAlert;
  expanded: boolean;
  onToggle: () => void;
  delay: number;
}) {
  const styles = RISK_STYLES[alert.riskLevel];

  return (
    <div
      className={`card border-2 ${styles.border} overflow-hidden animate-slide-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full text-left p-5 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Risk Indicator */}
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${styles.bg}`}>
              <AlertTriangle className={`h-6 w-6 ${styles.text}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`badge ${styles.bg} ${styles.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${styles.dot} animate-pulse`} />
                  {alert.riskLevel} Risk
                </span>
                <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  <CountryFlag code={alert.country === 'India' ? 'IN' : alert.country === 'Brazil' ? 'BR' : alert.country === 'Russia' ? 'RU' : alert.country === 'China' ? 'CN' : 'ZA'} />
                  {alert.city}, {alert.country}
                </span>
                <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  <CategoryIcon category={alert.category} className="text-xs" /> {alert.category}
                </span>
              </div>
              <h3 className="font-display text-base font-bold text-gray-900 dark:text-white mb-1">
                {alert.infrastructure}
              </h3>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  {Math.round(alert.failureProbability * 100)}% failure probability
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  ~{alert.estimatedTimeframe}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {alert.affectedPopulation.toLocaleString()} at risk
                </span>
              </div>
            </div>

            <ChevronDown className={`h-5 w-5 text-gray-400 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-200 dark:border-gray-800 p-5 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Factors */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                <TrendingDown className="h-4 w-4" /> Contributing Risk Factors
              </h4>
              <div className="space-y-2">
                {alert.factors.map((factor, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${styles.dot} shrink-0`} />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>

              {/* Probability Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Failure Probability</span>
                  <span className={`text-sm font-bold ${styles.text}`}>{Math.round(alert.failureProbability * 100)}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${styles.dot} transition-all duration-1000`}
                    style={{ width: `${alert.failureProbability * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Recommended Action */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4 text-primary-500" /> Recommended Action
              </h4>
              <div className={`rounded-xl ${styles.bg} p-4`}>
                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                  {alert.recommendedAction}
                </p>
              </div>

              {/* Impact Summary */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3">
                  <span className="text-xs text-gray-400 dark:text-gray-500">Affected Population</span>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {alert.affectedPopulation.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3">
                  <span className="text-xs text-gray-400 dark:text-gray-500">Estimated Timeframe</span>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{alert.estimatedTimeframe}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
