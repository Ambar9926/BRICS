import { BarChart3, Shield } from 'lucide-react';
import { ImpactDashboard } from '@/components/government/ImpactDashboard';
import { GovernmentDashboard } from '@/components/government/GovernmentDashboard';

export function GovernmentPortal() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
            <Shield className="h-3 w-3" /> Government & Policymaker Portal
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
          Response Command Center
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
          Review citizen complaints, manage response teams, and track real-time infrastructure impact across BRICS nations.
        </p>
      </div>

      {/* Impact Dashboard */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">Real-Time Impact Dashboard</h2>
        </div>
        <ImpactDashboard />
      </div>

      {/* Complaint Management */}
      <div>
        <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-4">Complaint Management</h2>
        <GovernmentDashboard />
      </div>
    </div>
  );
}
