import { useState } from 'react';
import { Search, Ticket, CheckCircle2, AlertCircle, Clock, DollarSign } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import {
  StatusBadge,
  PriorityBadge,
  CountryFlag,
  CategoryIcon,
  StatusProgress,
} from '@/components/shared/Badges';
import type { Complaint } from '@/types';

export function TicketTracking() {
  const { complaints } = useAppData();
  const [ticketId, setTicketId] = useState('');
  const [result, setResult] = useState<Complaint | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const found = complaints.find(
      (c) => c.id.toLowerCase() === ticketId.trim().toLowerCase(),
    );
    setResult(found || null);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-1">Track Your Ticket</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your Ticket ID to view real-time status updates.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="e.g., BRICS-IN-1082"
            className="input-field pl-10 font-mono"
          />
        </div>
        <button type="submit" className="btn-primary">
          <Search className="h-4 w-4" /> Track
        </button>
      </form>

      {/* Example IDs */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-400 dark:text-gray-500">Try:</span>
        {['BRICS-IN-1082', 'BRICS-BR-2051', 'BRICS-RU-3104'].map((id) => (
          <button
            key={id}
            onClick={() => { setTicketId(id); }}
            className="rounded-lg bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-xs font-mono text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {id}
          </button>
        ))}
      </div>

      {/* Results */}
      {searched && !result && (
        <div className="card p-8 text-center animate-slide-down">
          <AlertCircle className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Ticket not found</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Please check your Ticket ID and try again.
          </p>
        </div>
      )}

      {result && <TicketDetail complaint={result} />}
    </div>
  );
}

function TicketDetail({ complaint }: { complaint: Complaint }) {
  const steps = [
    { label: 'Submitted', icon: Ticket, desc: 'Your complaint has been registered' },
    { label: 'Under Review', icon: Clock, desc: 'Government team is assessing the issue' },
    { label: 'Budget Allocated', icon: DollarSign, desc: 'Funds have been assigned for resolution' },
    { label: 'Resolved', icon: CheckCircle2, desc: 'Issue has been resolved' },
  ];
  const currentIndex = steps.findIndex((s) => s.label === complaint.status);

  return (
    <div className="card p-6 animate-slide-down">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-sm font-bold text-primary-600 dark:text-primary-400">{complaint.id}</span>
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
          </div>
          <h4 className="font-display text-base font-bold text-gray-900 dark:text-white">{complaint.title}</h4>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{complaint.description}</p>

      {/* Meta */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3">
          <span className="text-xs text-gray-400 dark:text-gray-500">Country</span>
          <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
            <CountryFlag code={complaint.countryCode} /> {complaint.country}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3">
          <span className="text-xs text-gray-400 dark:text-gray-500">City / Area</span>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{complaint.city}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{complaint.area}</p>
        </div>
        <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3">
          <span className="text-xs text-gray-400 dark:text-gray-500">Category</span>
          <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
            <CategoryIcon category={complaint.category} className="text-sm" /> {complaint.category}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3">
          <span className="text-xs text-gray-400 dark:text-gray-500">Community Votes</span>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{complaint.votes.toLocaleString()}</p>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status Timeline</h5>
          <StatusProgress status={complaint.status} />
        </div>
        <div className="space-y-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isComplete = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div key={step.label} className="flex items-start gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 transition-colors ${
                  isComplete
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                } ${isCurrent ? 'ring-4 ring-primary-500/20' : ''}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="pt-1">
                  <p className={`text-sm font-semibold ${isComplete ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
                    {step.label}
                    {isCurrent && <span className="ml-2 text-xs text-primary-600 dark:text-primary-400">Current</span>}
                  </p>
                  <p className={`text-xs ${isComplete ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Assessment */}
      {complaint.aiDamageAssessment && (
        <div className="mt-4 rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">AI Damage Assessment</span>
            <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
              {Math.round(complaint.aiDamageAssessment.confidence * 100)}% confidence
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{complaint.aiDamageAssessment.description}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Estimated repair cost: <span className="font-semibold text-gray-700 dark:text-gray-300">{complaint.aiDamageAssessment.estimatedRepairCost}</span>
          </p>
        </div>
      )}

      {/* Assigned Team */}
      {complaint.assignedTeam && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-success-50 dark:bg-success-900/20 p-3">
          <CheckCircle2 className="h-4 w-4 text-success-600 dark:text-success-400" />
          <span className="text-sm text-success-700 dark:text-success-300">
            Assigned to: <span className="font-semibold">{complaint.assignedTeam}</span>
          </span>
        </div>
      )}
    </div>
  );
}
