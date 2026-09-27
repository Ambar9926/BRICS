import { X, MapPin, TrendingUp, Users, Clock, ThumbsUp, MessageSquare, Activity } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { mockHotspots, mockRegionalIssues, mockFeedbackLogs } from '@/data/mockData';
import {
  StatusBadge,
  CategoryIcon,
  CountryFlag,
  SeverityIndicator,
} from '@/components/shared/Badges';
import type { Hotspot } from '@/types';

export function RegionalDrawer() {
  const { selectedHotspotId, setSelectedHotspotId } = useAppData();

  if (!selectedHotspotId) return null;

  const hotspot = mockHotspots.find((h) => h.id === selectedHotspotId);
  if (!hotspot) return null;

  const issues = mockRegionalIssues[selectedHotspotId] || [];
  const feedback = mockFeedbackLogs[selectedHotspotId] || [];
  const resolutionRate = Math.round((hotspot.resolvedIssues / hotspot.totalIssues) * 100);

  const intensityColor =
    hotspot.intensity >= 85 ? 'bg-red-500' :
    hotspot.intensity >= 70 ? 'bg-orange-500' :
    hotspot.intensity >= 50 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-fade-in"
        onClick={() => setSelectedHotspotId(null)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:max-w-lg z-50 bg-white dark:bg-gray-950 shadow-2xl overflow-y-auto scrollbar-thin animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CountryFlag code={hotspot.countryCode} className="text-2xl" />
                <div>
                  <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">{hotspot.city}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{hotspot.country} · {hotspot.name}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedHotspotId(null)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Intensity Meter */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Deficiency Intensity</span>
              <span className="font-display text-2xl font-extrabold text-gray-900 dark:text-white">{hotspot.intensity}</span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className={`h-full rounded-full ${intensityColor} transition-all duration-1000`}
                style={{ width: `${hotspot.intensity}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Metric
                icon={Activity}
                label="Total Issues"
                value={String(hotspot.totalIssues)}
                color="text-primary-600 dark:text-primary-400"
              />
              <Metric
                icon={TrendingUp}
                label="Resolved"
                value={`${hotspot.resolvedIssues} (${resolutionRate}%)`}
                color="text-success-600 dark:text-success-400"
              />
              <Metric
                icon={Users}
                label="Citizens Impacted"
                value={hotspot.citizenImpact.toLocaleString()}
                color="text-accent-600 dark:text-accent-400"
              />
              <Metric
                icon={Clock}
                label="Avg Response"
                value={`${hotspot.avgResponseDays} days`}
                color="text-warning-600 dark:text-warning-400"
              />
            </div>
          </div>

          {/* Top Category */}
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/40">
              <CategoryIcon category={hotspot.topCategory} className="text-2xl" />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Most Critical Category</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{hotspot.topCategory}</p>
            </div>
          </div>

          {/* Top Voted Issues */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
              <ThumbsUp className="h-4 w-4" /> Top Voted Issues
            </h4>
            <div className="space-y-2">
              {issues.map((issue) => (
                <div key={issue.id} className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{issue.title}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      <CategoryIcon category={issue.category} className="text-xs" /> {issue.category}
                    </span>
                    <StatusBadge status={issue.status} />
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" /> {issue.votes.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Feedback Logs */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" /> Citizen Feedback Logs
            </h4>
            <div className="space-y-2">
              {feedback.map((log) => (
                <div key={log.id} className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{log.citizenName}</span>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${
                        log.sentiment === 'positive' ? 'bg-success-500' :
                        log.sentiment === 'negative' ? 'bg-error-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-xs text-gray-400 dark:text-gray-500">{log.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{log.message}"</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setSelectedHotspotId(null)}
            className="btn-primary w-full"
          >
            Close Regional Analysis
          </button>
        </div>
      </div>
    </>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon className={`h-3.5 w-3.5 ${color}`} />
        <span className="text-xs text-gray-400 dark:text-gray-500">{label}</span>
      </div>
      <p className="text-sm font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

export { SeverityIndicator };
