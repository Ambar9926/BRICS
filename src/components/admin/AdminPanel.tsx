import { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  Ticket,
  TrendingUp,
  LogOut,
  Activity,
  ShieldCheck,
  Globe2,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAppData } from '@/context/AppDataContext';
import {
  StatusBadge,
  PriorityBadge,
  CountryFlag,
  CategoryIcon,
} from '@/components/shared/Badges';
import type { TicketStatus } from '@/types';

type AdminSection = 'overview' | 'complaints' | 'analytics';

const STATUS_OPTIONS: TicketStatus[] = ['Submitted', 'Under Review', 'Budget Allocated', 'Resolved'];

export function AdminPanel() {
  const { profile, signOut } = useAuth();
  const { complaints, updateComplaintStatus } = useAppData();
  const [section, setSection] = useState<AdminSection>('overview');

  const stats = useMemo(() => {
    const total = complaints.length;
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;
    const active = complaints.filter((c) => c.status !== 'Resolved').length;
    const critical = complaints.filter((c) => c.priority === 'Critical').length;
    const totalVotes = complaints.reduce((sum, c) => sum + c.votes, 0);
    const byCountry: Record<string, number> = {};
    complaints.forEach((c) => {
      byCountry[c.country] = (byCountry[c.country] || 0) + 1;
    });
    const byCategory: Record<string, number> = {};
    complaints.forEach((c) => {
      byCategory[c.category] = (byCategory[c.category] || 0) + 1;
    });
    return { total, resolved, active, critical, totalVotes, byCountry, byCategory };
  }, [complaints]);

  const sections: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'complaints', label: 'Complaint Management', icon: Ticket },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="card p-5 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                Admin Control Panel
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Welcome, {profile?.display_name || 'Administrator'} · {profile?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300">
              <span className="h-1.5 w-1.5 rounded-full bg-success-500 animate-pulse" />
              Authenticated
            </span>
            <button onClick={signOut} className="btn-outline text-sm">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-thin">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                section === s.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'card text-gray-600 dark:text-gray-400 hover:shadow-md'
              }`}
            >
              <Icon className="h-4 w-4" /> {s.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div key={section} className="animate-fade-in">
        {section === 'overview' && (
          <OverviewSection stats={stats} complaints={complaints} />
        )}
        {section === 'complaints' && (
          <ComplaintsSection
            complaints={complaints}
            onStatusChange={updateComplaintStatus}
          />
        )}
        {section === 'analytics' && (
          <AnalyticsSection stats={stats} complaints={complaints} />
        )}
      </div>
    </div>
  );
}

// ─── Overview Section ───

function OverviewSection({
  stats,
  complaints,
}: {
  stats: ReturnType<typeof useMemo<{ total: number; resolved: number; active: number; critical: number; totalVotes: number; byCountry: Record<string, number>; byCategory: Record<string, number> }>>;
  complaints: ReturnType<typeof useAppData>['complaints'];
}) {
  const recent = [...complaints].slice(0, 5);

  const statCards = [
    { label: 'Total Complaints', value: stats.total, icon: Ticket, color: 'primary' },
    { label: 'Active Issues', value: stats.active, icon: Activity, color: 'warning' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'success' },
    { label: 'Critical Priority', value: stats.critical, icon: AlertTriangle, color: 'error' },
    { label: 'Total Citizen Votes', value: stats.totalVotes.toLocaleString(), icon: Users, color: 'accent' },
    { label: 'Countries Covered', value: Object.keys(stats.byCountry).length, icon: Globe2, color: 'primary' },
  ];

  const colorMap: Record<string, string> = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300',
    success: 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300',
    warning: 'bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-300',
    error: 'bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-300',
    accent: 'bg-accent-50 dark:bg-accent-900/20 text-accent-700 dark:text-accent-300',
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="card p-4 animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colorMap[card.color]} mb-2`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="font-display text-xl font-bold text-gray-900 dark:text-white tabular-nums">
                {card.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Complaints */}
      <div className="card p-5">
        <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white mb-4">
          Recent Complaints
        </h3>
        <div className="space-y-2">
          {recent.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 dark:border-gray-800 p-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <CountryFlag code={c.countryCode} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{c.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{c.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={c.status} />
                <PriorityBadge priority={c.priority} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Complaints Management ───

function ComplaintsSection({
  complaints,
  onStatusChange,
}: {
  complaints: ReturnType<typeof useAppData>['complaints'];
  onStatusChange: (id: string, status: TicketStatus) => void;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Ticket</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Location</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Priority</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">Votes</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {complaints.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-mono text-xs text-primary-600 dark:text-primary-400">{c.id}</p>
                  <p className="font-medium text-gray-900 dark:text-white line-clamp-1 max-w-[220px]">{c.title}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <CountryFlag code={c.countryCode} />
                    <span>{c.city}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
                <td className="px-4 py-3 hidden sm:table-cell text-gray-600 dark:text-gray-400 tabular-nums">
                  {c.votes.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={c.status}
                    onChange={(e) => onStatusChange(c.id, e.target.value as TicketStatus)}
                    className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Analytics Section ───

function AnalyticsSection({
  stats,
  complaints,
}: {
  stats: ReturnType<typeof useMemo<{ total: number; resolved: number; active: number; critical: number; totalVotes: number; byCountry: Record<string, number>; byCategory: Record<string, number> }>>;
  complaints: ReturnType<typeof useAppData>['complaints'];
}) {
  const maxCountry = Math.max(...Object.values(stats.byCountry), 1);
  const maxCategory = Math.max(...Object.values(stats.byCategory), 1);

  const statusBreakdown = STATUS_OPTIONS.map((status) => ({
    status,
    count: complaints.filter((c) => c.status === status).length,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* By Country */}
      <div className="card p-5">
        <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-primary-500" /> Complaints by Country
        </h3>
        <div className="space-y-3">
          {Object.entries(stats.byCountry).map(([country, count]) => (
            <div key={country}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700 dark:text-gray-300">{country}</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{count}</span>
              </div>
              <div className="h-6 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-lg bg-primary-500 transition-all duration-700"
                  style={{ width: `${(count / maxCountry) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* By Category */}
      <div className="card p-5">
        <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <CategoryIcon category="Transport" /> Complaints by Category
        </h3>
        <div className="space-y-3">
          {Object.entries(stats.byCategory).map(([category, count]) => (
            <div key={category}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <CategoryIcon category={category as never} className="text-sm" /> {category}
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{count}</span>
              </div>
              <div className="h-6 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-lg bg-accent-500 transition-all duration-700"
                  style={{ width: `${(count / maxCategory) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="card p-5 lg:col-span-2">
        <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary-500" /> Status Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusBreakdown.map(({ status, count }) => {
            const icons: Record<TicketStatus, typeof Ticket> = {
              'Submitted': Ticket,
              'Under Review': Clock,
              'Budget Allocated': DollarSign,
              'Resolved': CheckCircle2,
            };
            const Icon = icons[status];
            return (
              <div key={status} className="rounded-xl bg-gray-50 dark:bg-gray-900/50 p-4 text-center">
                <Icon className="h-6 w-6 mx-auto mb-2 text-primary-500" />
                <p className="font-display text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{status}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
