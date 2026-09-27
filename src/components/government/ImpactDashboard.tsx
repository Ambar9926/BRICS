import { CheckCircle2, Users, Building2, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';

export function ImpactDashboard() {
  const { complaints } = useAppData();

  const resolved = complaints.filter((c) => c.status === 'Resolved').length;
  const totalVotes = complaints.reduce((sum, c) => sum + c.votes, 0);
  const citizensImpacted = Math.round(totalVotes * 47.3);
  const activeProjects = complaints.filter(
    (c) => c.status === 'Budget Allocated' || c.status === 'Under Review',
  ).length;

  const stats = [
    {
      label: 'Total Complaints Resolved',
      value: resolved + 247,
      icon: CheckCircle2,
      color: 'success',
      change: '+12%',
    },
    {
      label: 'Citizens Impacted',
      value: citizensImpacted.toLocaleString(),
      icon: Users,
      color: 'primary',
      change: '+8.4%',
    },
    {
      label: 'Active Infrastructure Projects',
      value: activeProjects + 18,
      icon: Building2,
      color: 'accent',
      change: '+3',
    },
    {
      label: 'Avg. Response Time',
      value: '34 days',
      icon: TrendingUp,
      color: 'warning',
      change: '-15%',
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
    success: { bg: 'bg-success-50 dark:bg-success-900/20', text: 'text-success-700 dark:text-success-300', icon: 'bg-success-500' },
    primary: { bg: 'bg-primary-50 dark:bg-primary-900/20', text: 'text-primary-700 dark:text-primary-300', icon: 'bg-primary-500' },
    accent: { bg: 'bg-accent-50 dark:bg-accent-900/20', text: 'text-accent-700 dark:text-accent-300', icon: 'bg-accent-500' },
    warning: { bg: 'bg-warning-50 dark:bg-warning-900/20', text: 'text-warning-700 dark:text-warning-300', icon: 'bg-warning-500' },
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        const colors = colorMap[stat.color];
        return (
          <div key={idx} className="card p-5 animate-slide-up" style={{ animationDelay: `${idx * 60}ms` }}>
            <div className="flex items-start justify-between mb-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg}`}>
                <Icon className={`h-5 w-5 ${colors.text}`} />
              </div>
              <span className={`badge ${colors.bg} ${colors.text} text-xs`}>
                <ArrowUpRight className="h-3 w-3" /> {stat.change}
              </span>
            </div>
            <p className="font-display text-2xl font-extrabold text-gray-900 dark:text-white tabular-nums">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
