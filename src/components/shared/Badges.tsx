import type { TicketStatus, Priority, Category, CountryCode } from '@/types';

export function StatusBadge({ status }: { status: TicketStatus }) {
  const styles: Record<TicketStatus, string> = {
    'Submitted': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    'Under Review': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    'Budget Allocated': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    'Resolved': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  };
  return <span className={`badge ${styles[status]}`}>{status}</span>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    Low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    Critical: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  };
  return <span className={`badge ${styles[priority]}`}>{priority}</span>;
}

export function CategoryIcon({ category, className = 'w-4 h-4' }: { category: Category; className?: string }) {
  const icons: Record<Category, string> = {
    Transport: '🚧',
    Water: '💧',
    Energy: '⚡',
    Sanitation: '🚿',
    Digital: '📡',
    Housing: '🏠',
    Healthcare: '🏥',
  };
  return <span className={className}>{icons[category]}</span>;
}

export function CountryFlag({ code, className = '' }: { code: CountryCode; className?: string }) {
  const flags: Record<CountryCode, string> = {
    IN: '🇮🇳',
    BR: '🇧🇷',
    RU: '🇷🇺',
    CN: '🇨🇳',
    ZA: '🇿🇦',
  };
  return <span className={className}>{flags[code]}</span>;
}

export function StatusProgress({ status }: { status: TicketStatus }) {
  const steps: TicketStatus[] = ['Submitted', 'Under Review', 'Budget Allocated', 'Resolved'];
  const currentIndex = steps.indexOf(status);

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, idx) => (
        <div key={step} className="flex items-center gap-1">
          <div
            className={`h-1.5 w-8 rounded-full transition-colors ${
              idx <= currentIndex
                ? 'bg-primary-500'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        </div>
      ))}
    </div>
  );
}

export function SeverityIndicator({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    Minor: 'text-green-600 dark:text-green-400',
    Moderate: 'text-yellow-600 dark:text-yellow-400',
    Severe: 'text-orange-600 dark:text-orange-400',
    Critical: 'text-red-600 dark:text-red-400',
  };
  const dotColors: Record<string, string> = {
    Minor: 'bg-green-500',
    Moderate: 'bg-yellow-500',
    Severe: 'bg-orange-500',
    Critical: 'bg-red-500',
  };
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${dotColors[severity]} animate-pulse`} />
      <span className={`text-sm font-semibold ${colors[severity]}`}>{severity}</span>
    </div>
  );
}
