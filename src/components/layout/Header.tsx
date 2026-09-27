import { Sun, Moon, Globe2, Github, ShieldCheck } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAppData } from '@/context/AppDataContext';
import { useAuth } from '@/context/AuthContext';
import type { TabId } from '@/types';

const TABS: { id: TabId; label: string }[] = [
  { id: 'citizen', label: 'Citizen Portal' },
  { id: 'government', label: 'Government Response' },
  { id: 'gis', label: 'GIS Heatmap' },
  { id: 'simulator', label: 'Policy Simulator' },
  { id: 'alerts', label: 'Predictive Alerts' },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { activeTab, setActiveTab } = useAppData();
  const { isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => setActiveTab('citizen')}
            className="flex items-center gap-2.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-md">
              <Globe2 className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-display text-sm font-extrabold leading-tight text-gray-900 dark:text-white">
                BRICS Infrastructure
              </p>
              <p className="text-xs font-medium leading-tight text-primary-600 dark:text-primary-400">
                Demand AI Platform
              </p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  activeTab === tab.id
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <span className="hidden md:flex badge bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300">
              <span className="h-1.5 w-1.5 rounded-full bg-success-500 animate-pulse" />
              Live
            </span>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                activeTab === 'admin'
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-label="Admin Panel"
            >
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </button>
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <nav className="lg:hidden flex items-center gap-1 overflow-x-auto scrollbar-thin pb-2" aria-label="Mobile navigation">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                activeTab === tab.id
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => setActiveTab('admin')}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              activeTab === 'admin'
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Admin
          </button>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
                <Globe2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold text-gray-900 dark:text-white">BRICS Infrastructure Demand AI</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
              A Digital Public Infrastructure platform empowering BRICS citizens to report infrastructure needs, and enabling governments to respond with data-driven precision.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>Citizen Reporting Portal</li>
              <li>Government Response Dashboard</li>
              <li>GIS Regional Analytics</li>
              <li>AI Budget Simulator</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">BRICS Nations</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>India</li>
              <li>Brazil</li>
              <li>Russia</li>
              <li>China</li>
              <li>South Africa</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Track 1: Build with AI — Code for Communities Hackathon
          </p>
          <div className="flex items-center gap-3">
            <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">DPI</span>
            <span className="badge bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300">AI-Powered</span>
            <Github className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </footer>
  );
}
