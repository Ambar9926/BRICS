import { useState, useMemo } from 'react';
import { Search, ArrowUp, Flame, Filter } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { COUNTRIES, CATEGORIES } from '@/data/mockData';
import { StatusBadge, PriorityBadge, CountryFlag, CategoryIcon } from '@/components/shared/Badges';
import type { Country, Category } from '@/types';

export function CommunityUpvoting() {
  const { complaints, upvoteComplaint } = useAppData();
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState<Country | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const sorted = useMemo(() => {
    return [...complaints]
      .filter((c) => {
        if (countryFilter !== 'all' && c.country !== countryFilter) return false;
        if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            c.title.toLowerCase().includes(q) ||
            c.city.toLowerCase().includes(q) ||
            c.area.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => b.votes - a.votes);
  }, [complaints, search, countryFilter, categoryFilter]);

  const handleUpvote = (id: string) => {
    if (votedIds.has(id)) return;
    upvoteComplaint(id);
    setVotedIds((prev) => new Set(prev).add(id));
  };

  const topVote = sorted.length > 0 ? sorted[0].votes : 1;

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-1">Community Upvoting</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Browse and upvote local infrastructure complaints. Higher votes boost priority ranking.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by area, city, or ticket ID..."
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value as Country | 'all')}
              className="input-field pl-9 text-sm"
            >
              <option value="all">All Countries</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as Category | 'all')}
            className="input-field text-sm"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Complaint List */}
      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
            No complaints found matching your filters.
          </div>
        ) : (
          sorted.map((complaint, idx) => (
            <div
              key={complaint.id}
              className="card p-4 hover:shadow-md transition-shadow animate-slide-up"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              <div className="flex items-start gap-4">
                {/* Upvote Button */}
                <button
                  onClick={() => handleUpvote(complaint.id)}
                  disabled={votedIds.has(complaint.id)}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 shrink-0 transition-all ${
                    votedIds.has(complaint.id)
                      ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400'
                  } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  aria-label="Upvote"
                >
                  <ArrowUp className="h-5 w-5" />
                  <span className="text-sm font-bold tabular-nums">{complaint.votes}</span>
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-gray-400 dark:text-gray-500">{complaint.id}</span>
                      {idx === 0 && complaint.votes === topVote && (
                        <span className="badge bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                          <Flame className="h-3 w-3" /> Top Voted
                        </span>
                      )}
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                    {complaint.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                    {complaint.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      <CountryFlag code={complaint.countryCode} className="text-xs" /> {complaint.city}
                    </span>
                    <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      <CategoryIcon category={complaint.category} className="text-xs" /> {complaint.category}
                    </span>
                    <StatusBadge status={complaint.status} />
                    <PriorityBadge priority={complaint.priority} />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
