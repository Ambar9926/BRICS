import { FormInput, Mic2, MessageSquare, ThumbsUp, Ticket } from 'lucide-react';
import { ReportForm } from '@/components/citizen/ReportForm';
import { VoiceInput } from '@/components/citizen/VoiceInput';
import { ChatAssistant } from '@/components/citizen/ChatAssistant';
import { CommunityUpvoting } from '@/components/citizen/CommunityUpvoting';
import { TicketTracking } from '@/components/citizen/TicketTracking';
import { useState } from 'react';

type CitizenTab = 'report' | 'voice' | 'chat' | 'upvote' | 'track';

const TABS: { id: CitizenTab; label: string; icon: typeof FormInput; description: string }[] = [
  { id: 'report', label: 'Report Issue', icon: FormInput, description: 'Web form with AI photo analysis' },
  { id: 'voice', label: 'Voice Note', icon: Mic2, description: 'Multilingual voice reporting' },
  { id: 'chat', label: 'BRICS AI Chat', icon: MessageSquare, description: 'Chat with AI assistant' },
  { id: 'upvote', label: 'Community', icon: ThumbsUp, description: 'Upvote local issues' },
  { id: 'track', label: 'Track Ticket', icon: Ticket, description: 'Check complaint status' },
];

export function CitizenPortal() {
  const [tab, setTab] = useState<CitizenTab>('report');

  return (
    <div className="mx-auto max-w-5xl">
      {/* Hero */}
      <div className="mb-8 text-center">
        <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 mb-3">
          Citizen Portal
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
          Report. Track. Resolve.
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Report infrastructure issues in your community through multiple channels. Our AI-powered platform
          ensures your voice reaches the right government team.
        </p>
      </div>

      {/* Input Method Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-col items-center gap-2 rounded-xl p-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                tab === t.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'card hover:shadow-md text-gray-600 dark:text-gray-400'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-semibold">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div key={tab}>
        {tab === 'report' && <ReportForm />}
        {tab === 'voice' && <VoiceInput />}
        {tab === 'chat' && (
          <div className="mx-auto max-w-2xl">
            <ChatAssistant />
          </div>
        )}
        {tab === 'upvote' && <CommunityUpvoting />}
        {tab === 'track' && <TicketTracking />}
      </div>
    </div>
  );
}
