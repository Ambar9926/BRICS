import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Complaint, TabId } from '@/types';
import { mockComplaints } from '@/data/mockData';

interface AppDataContextValue {
  complaints: Complaint[];
  addComplaint: (complaint: Complaint) => void;
  upvoteComplaint: (id: string) => void;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
  assignTeam: (id: string, team: string) => void;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  selectedHotspotId: string | null;
  setSelectedHotspotId: (id: string | null) => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [activeTab, setActiveTab] = useState<TabId>('citizen');
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);

  const addComplaint = useCallback((complaint: Complaint) => {
    setComplaints((prev) => [complaint, ...prev]);
  }, []);

  const upvoteComplaint = useCallback((id: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, votes: c.votes + 1 } : c)),
    );
  }, []);

  const updateComplaintStatus = useCallback((id: string, status: Complaint['status']) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c)),
    );
  }, []);

  const assignTeam = useCallback((id: string, team: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, assignedTeam: team } : c)),
    );
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        complaints,
        addComplaint,
        upvoteComplaint,
        updateComplaintStatus,
        assignTeam,
        activeTab,
        setActiveTab,
        selectedHotspotId,
        setSelectedHotspotId,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
