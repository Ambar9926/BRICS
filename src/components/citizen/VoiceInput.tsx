import { useState, useRef } from 'react';
import { Mic, Square, Loader2, Languages, Play } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ru', label: 'Russian' },
  { code: 'zh', label: 'Chinese' },
  { code: 'zu', label: 'Zulu' },
];

interface VoiceNote {
  id: string;
  language: string;
  duration: string;
  transcript: string;
  timestamp: string;
}

export function VoiceInput() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [language, setLanguage] = useState('en');
  const [transcribing, setTranscribing] = useState(false);
  const [notes, setNotes] = useState<VoiceNote[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    const duration = `${Math.floor(recordingTime / 60)}:${String(recordingTime % 60).padStart(2, '0')}`;
    setTranscribing(true);

    // Simulated transcription (Gemini Flash NLP placeholder)
    await new Promise((r) => setTimeout(r, 1500));

    const mockTranscripts: Record<string, string> = {
      en: 'There is a large pothole on the main road near the community center. It has been there for 3 weeks and two motorcycles have already crashed. Please fix it urgently.',
      hi: 'सामुदायिक केंद्र के पास मुख्य सड़क पर एक बड़ा गड्ढा है। यह 3 सप्ताह से है और दो मोटरसाइकिलें पहले ही दुर्घटनाग्रस्त हो चुकी हैं। कृपया इसे जल्दी ठीक करें।',
      pt: 'Há um grande buraco na estrada principal perto do centro comunitário. Está lá há 3 semanas e duas motos já caíram. Por favor, consertem urgente.',
      ru: 'На главной дороге возле общественного центра большая яма. Она там уже 3 недели, и два мотоцикла уже попали в аварию. Пожалуйста, срочно почините.',
      zh: '社区中心附近的主路上有一个大坑。已经3周了，两辆摩托车已经摔倒了。请紧急修复。',
      zu: 'Kukhona isigaxa esikhulu endleleni efile eduze kwesikhungo somphakathi. Sibe khona izinsuku ezi-3 futhi amamotha amabili esedonse. Sicela silungise ngokushesha.',
    };

    const note: VoiceNote = {
      id: `vn-${Date.now()}`,
      language,
      duration,
      transcript: mockTranscripts[language] || mockTranscripts.en,
      timestamp: new Date().toLocaleTimeString(),
    };

    setNotes((prev) => [note, ...prev]);
    setTranscribing(false);
    setRecordingTime(0);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="card p-6 sm:p-8 animate-fade-in">
      <div className="mb-6">
        <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">Voice Note Input</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Record a voice note in your preferred language. AI transcription converts it to a text complaint.
        </p>
      </div>

      {/* Language Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <span className="inline-flex items-center gap-1"><Languages className="w-3.5 h-3.5" /> Select Language</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              disabled={isRecording}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all disabled:opacity-50 ${
                language === lang.code
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recording Control */}
      <div className="flex flex-col items-center justify-center py-8 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 mb-6">
        {isRecording ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-3 w-3 rounded-full bg-red-500 animate-pulse" />
              <span className="font-display text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                {formatTime(recordingTime)}
              </span>
            </div>
            <button
              onClick={stopRecording}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-500/30"
              aria-label="Stop recording"
            >
              <Square className="h-6 w-6" fill="currentColor" />
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Recording... Click to stop</p>
          </>
        ) : transcribing ? (
          <>
            <Loader2 className="h-10 w-10 text-primary-500 animate-spin mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Transcribing with Gemini Flash...</p>
          </>
        ) : (
          <>
            <button
              onClick={startRecording}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary-500/30"
              aria-label="Start recording"
            >
              <Mic className="h-6 w-6" />
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Click to start recording</p>
          </>
        )}
      </div>

      {/* Voice Notes History */}
      {notes.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recorded Notes</h4>
          {notes.map((note) => (
            <div key={note.id} className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 animate-slide-down">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/60 transition-colors">
                    <Play className="h-4 w-4" fill="currentColor" />
                  </button>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{note.duration}</span>
                  <span className="badge bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {LANGUAGES.find((l) => l.code === note.language)?.label || note.language}
                  </span>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">{note.timestamp}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{note.transcript}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
