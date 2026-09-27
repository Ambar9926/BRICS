import { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  UserCog,
  ArrowUpDown,
  MapPin,
  ThumbsUp,
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { COUNTRIES, CATEGORIES, mockResponseTeams } from '@/data/mockData';
import {
  StatusBadge,
  PriorityBadge,
  CountryFlag,
  CategoryIcon,
} from '@/components/shared/Badges';
import type { Country, Category, TicketStatus, Complaint } from '@/types';

const STATUS_OPTIONS: TicketStatus[] = ['Submitted', 'Under Review', 'Budget Allocated', 'Resolved'];

export function GovernmentDashboard() {
  const { complaints, updateComplaintStatus, assignTeam } = useAppData();
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState<Country | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [sortByVotes, setSortByVotes] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return [...complaints]
      .filter((c) => {
        if (countryFilter !== 'all' && c.country !== countryFilter) return false;
        if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
        if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
        if (statusFilter !== 'all' && c.status !== statusFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            c.title.toLowerCase().includes(q) ||
            c.city.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q) ||
            c.citizenName.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => (sortByVotes ? b.votes - a.votes : 0));
  }, [complaints, search, countryFilter, categoryFilter, priorityFilter, statusFilter, sortByVotes]);

  const handleStatusChange = (id: string, status: TicketStatus) => {
    updateComplaintStatus(id, status);
  };

  const handleTeamAssign = (id: string, team: string) => {
    assignTeam(id, team);
  };

  return (
    <div className="animate-fade-in">
      {/* Filters Bar */}
      <div className="card p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, city, ticket ID, or citizen name..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as Category | 'all')}
              className="input-field text-sm w-auto"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-field text-sm w-auto"
            >
              <option value="all">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'all')}
              className="input-field text-sm w-auto"
            >
              <option value="all">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={() => setSortByVotes(!sortByVotes)}
              className={`btn-outline text-sm ${sortByVotes ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300' : ''}`}
            >
              <ArrowUpDown className="h-3.5 w-3.5" /> Votes
            </button>
          </div>
        </div>
      </div>

      {/* Complaint Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Ticket</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 hidden md:table-cell">Location</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 hidden lg:table-cell">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Priority</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400 hidden sm:table-cell">Votes</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No complaints match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((complaint) => (
                  <ComplaintRow
                    key={complaint.id}
                    complaint={complaint}
                    expanded={expandedId === complaint.id}
                    onToggle={() => setExpandedId(expandedId === complaint.id ? null : complaint.id)}
                    onStatusChange={handleStatusChange}
                    onTeamAssign={handleTeamAssign}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
        Showing {filtered.length} of {complaints.length} complaints
      </p>
    </div>
  );
}

function ComplaintRow({
  complaint,
  expanded,
  onToggle,
  onStatusChange,
  onTeamAssign,
}: {
  complaint: Complaint;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (id: string, status: TicketStatus) => void;
  onTeamAssign: (id: string, team: string) => void;
}) {
  const availableTeams = mockResponseTeams.filter(
    (t) => t.specialization === complaint.category && t.status !== 'On Leave',
  );

  return (
    <>
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
        <td className="px-4 py-3">
          <button onClick={onToggle} className="flex items-center gap-2 text-left focus:outline-none">
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            <div>
              <p className="font-mono text-xs text-primary-600 dark:text-primary-400">{complaint.id}</p>
              <p className="font-medium text-gray-900 dark:text-white line-clamp-1 max-w-[200px]">{complaint.title}</p>
            </div>
          </button>
        </td>
        <td className="px-4 py-3 hidden md:table-cell">
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <CountryFlag code={complaint.countryCode} />
            <span>{complaint.city}</span>
          </div>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell">
          <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            <CategoryIcon category={complaint.category} className="text-xs" /> {complaint.category}
          </span>
        </td>
        <td className="px-4 py-3"><PriorityBadge priority={complaint.priority} /></td>
        <td className="px-4 py-3 hidden sm:table-cell">
          <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <ThumbsUp className="h-3 w-3" /> {complaint.votes.toLocaleString()}
          </span>
        </td>
        <td className="px-4 py-3"><StatusBadge status={complaint.status} /></td>
        <td className="px-4 py-3">
          <select
            value={complaint.status}
            onChange={(e) => onStatusChange(complaint.id, e.target.value as TicketStatus)}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-gray-50/50 dark:bg-gray-900/20">
          <td colSpan={7} className="px-4 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-slide-down">
              {/* Details */}
              <div className="lg:col-span-2">
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Complaint Details</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{complaint.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-xs">
                    <span className="text-gray-400 dark:text-gray-500">Citizen:</span>
                    <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">{complaint.citizenName}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-400 dark:text-gray-500">Filed:</span>
                    <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">{complaint.createdAt}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-400 dark:text-gray-500">Area:</span>
                    <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">{complaint.area}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-gray-400 dark:text-gray-500">Assigned Team:</span>
                    <span className="ml-2 font-medium text-gray-700 dark:text-gray-300">{complaint.assignedTeam || 'Unassigned'}</span>
                  </div>
                </div>
                {complaint.aiDamageAssessment && (
                  <div className="mt-3 rounded-lg border border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/20 p-3">
                    <p className="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-1">AI Damage Assessment</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{complaint.aiDamageAssessment.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Severity: <span className="font-semibold">{complaint.aiDamageAssessment.severity}</span> ·
                      Est. Cost: <span className="font-semibold">{complaint.aiDamageAssessment.estimatedRepairCost}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Assign Team */}
              <div>
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <UserCog className="h-4 w-4" /> Assign Response Team
                </h5>
                <div className="space-y-2">
                  {availableTeams.length === 0 ? (
                    <p className="text-xs text-gray-400 dark:text-gray-500">No available teams for this category.</p>
                  ) : (
                    availableTeams.map((team) => (
                      <button
                        key={team.id}
                        onClick={() => onTeamAssign(complaint.id, team.name)}
                        className={`w-full text-left rounded-lg border p-2.5 text-xs transition-all ${
                          complaint.assignedTeam === team.name
                            ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-700'
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 dark:text-white">{team.name}</span>
                          {complaint.assignedTeam === team.name && (
                            <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">Assigned</span>
                          )}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                          {team.country} · {team.status} · {team.activeTickets} active
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
