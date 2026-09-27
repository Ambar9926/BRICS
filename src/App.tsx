import { useEffect, useRef } from 'react';
import { AppDataProvider, useAppData } from '@/context/AppDataContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Header, Footer } from '@/components/layout/Header';
import { CitizenPortal } from '@/components/citizen/CitizenPortal';
import { GovernmentPortal } from '@/components/government/GovernmentPortal';
import { GISHeatmap } from '@/components/gis/GISHeatmap';
import { PolicySimulator } from '@/components/simulator/PolicySimulator';
import { PredictiveAlerts } from '@/components/alerts/PredictiveAlerts';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { Loader2 } from 'lucide-react';
import type { TabId } from '@/types';

function TabContent() {
  const { activeTab } = useAppData();
  const { loading, isAdmin, signOut } = useAuth();
  const prevTab = useRef<TabId | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Auto sign-out when leaving the admin tab
  useEffect(() => {
    if (prevTab.current === 'admin' && activeTab !== 'admin' && isAdmin) {
      signOut();
    }
    prevTab.current = activeTab;
  }, [activeTab, isAdmin, signOut]);

  // Admin tab: requires auth + admin status
  if (activeTab === 'admin') {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
        </div>
      );
    }
    if (!isAdmin) {
      return <AdminLogin />;
    }
    return <AdminPanel />;
  }

  return (
    <main className="py-8 px-4 sm:px-6 lg:px-8">
      <div key={activeTab} className="animate-fade-in">
        {activeTab === 'citizen' && <CitizenPortal />}
        {activeTab === 'government' && <GovernmentPortal />}
        {activeTab === 'gis' && <GISHeatmap />}
        {activeTab === 'simulator' && <PolicySimulator />}
        {activeTab === 'alerts' && <PredictiveAlerts />}
      </div>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
          <Header />
          <div className="flex-1">
            <TabContent />
          </div>
          <Footer />
        </div>
      </AppDataProvider>
    </AuthProvider>
  );
}
