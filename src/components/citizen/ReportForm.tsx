import { useState } from 'react';
import {
  Camera,
  Upload,
  MapPin,
  Tag,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
  Sparkles,
} from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';
import { COUNTRIES, CATEGORIES } from '@/data/mockData';
import { analyzeInfrastructurePhoto } from '@/hooks/useGemini';
import { StatusBadge, PriorityBadge } from '@/components/shared/Badges';
import type { Country, Category, DamageAssessment, Complaint } from '@/types';

export function ReportForm() {
  const { addComplaint } = useAppData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState<Country>('India');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [category, setCategory] = useState<Category>('Transport');
  const [citizenName, setCitizenName] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoMime, setPhotoMime] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [assessment, setAssessment] = useState<DamageAssessment | null>(null);
  const [submitted, setSubmitted] = useState<Complaint | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      const base64 = result.split(',')[1];
      setPhotoBase64(base64);
      setPhotoMime(file.type);
    };
    reader.readAsDataURL(file);
  };

  const runAssessment = async () => {
    if (!photoBase64) return;
    setAnalyzing(true);
    try {
      const result = await analyzeInfrastructurePhoto(
        photoBase64,
        photoMime,
        `${category} issue in ${city}, ${country}: ${title}`,
      );
      setAssessment(result.assessment);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setAssessment({
        severity: 'None',
        confidence: 0,
        description: `AI analysis could not be completed (${errMsg}). Please try again with a clear photo of the infrastructure issue.`,
        detectedIssues: [],
        estimatedRepairCost: 'Not applicable',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const generateTicketId = () => {
    const codeMap: Record<Country, string> = {
      India: 'IN',
      Brazil: 'BR',
      Russia: 'RU',
      China: 'CN',
      'South Africa': 'ZA',
    };
    const num = Math.floor(1000 + Math.random() * 9000);
    return `BRICS-${codeMap[country]}-${num}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = generateTicketId();
    const priority = assessment && assessment.severity !== 'None'
      ? assessment.severity === 'Critical'
        ? 'Critical'
        : assessment.severity === 'Severe'
          ? 'High'
          : assessment.severity === 'Moderate'
            ? 'Medium'
            : 'Low'
      : 'Medium';

    const complaint: Complaint = {
      id,
      title,
      description,
      country,
      countryCode: COUNTRIES.find((c) => c.name === country)!.code,
      city,
      area,
      category,
      status: 'Submitted',
      priority,
      votes: 0,
      citizenName: citizenName || 'Anonymous',
      createdAt: new Date().toISOString().split('T')[0],
      photoUrl: photoPreview || undefined,
      aiDamageAssessment: assessment || undefined,
    };

    addComplaint(complaint);
    setSubmitted(complaint);
    // Reset form
    setTitle('');
    setDescription('');
    setCity('');
    setArea('');
    setCitizenName('');
    setPhotoPreview(null);
    setPhotoBase64(null);
    setAssessment(null);
  };

  if (submitted) {
    return (
      <div className="card p-8 text-center animate-slide-up">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-100 dark:bg-success-900/40">
          <CheckCircle2 className="h-8 w-8 text-success-600 dark:text-success-400" />
        </div>
        <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">
          Complaint Filed Successfully
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Your ticket has been registered. Save your Ticket ID to track status.
        </p>
        <div className="mx-auto inline-flex items-center gap-2 rounded-xl bg-primary-50 dark:bg-primary-900/30 px-6 py-3 mb-6">
          <span className="text-xs font-medium text-primary-600 dark:text-primary-400">Your Ticket ID:</span>
          <span className="font-display text-lg font-bold text-primary-700 dark:text-primary-300">{submitted.id}</span>
        </div>
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <button
            onClick={() => setSubmitted(null)}
            className="btn-primary"
          >
            File Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 sm:p-8 animate-fade-in">
      <div className="mb-6">
        <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">Report Infrastructure Issue</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Provide details and optionally upload a photo for AI damage assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Issue Title <span className="text-error-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Pothole damage on NH-44"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Your Name
          </label>
          <input
            type="text"
            value={citizenName}
            onChange={(e) => setCitizenName(e.target.value)}
            placeholder="Optional (or remain anonymous)"
            className="input-field"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Description <span className="text-error-500">*</span>
        </label>
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the infrastructure issue, its impact, and how long it has been a problem..."
          className="input-field resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Country</span>
          </label>
          <select value={country} onChange={(e) => setCountry(e.target.value as Country)} className="input-field">
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            City <span className="text-error-500">*</span>
          </label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g., Jabalpur"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Area / Location
          </label>
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g., NH-44 Junction"
            className="input-field"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          <span className="inline-flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Category</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Upload & AI Assessment */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          <span className="inline-flex items-center gap-1"><Camera className="w-3.5 h-3.5" /> Photo Upload (for AI Damage Assessment)</span>
        </label>
        {photoPreview ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <img src={photoPreview} alt="Upload preview" className="w-full h-48 object-cover" />
            <button
              type="button"
              onClick={() => { setPhotoPreview(null); setPhotoBase64(null); setAssessment(null); }}
              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 py-8 cursor-pointer hover:border-primary-400 dark:hover:border-primary-600 transition-colors">
            <Upload className="h-8 w-8 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Click to upload a photo of the infrastructure damage</span>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
        )}

        {photoBase64 && !assessment && (
          <button
            type="button"
            onClick={runAssessment}
            disabled={analyzing}
            className="btn-outline mt-3 w-full"
          >
            {analyzing ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing with Gemini Vision...</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Run AI Damage Assessment</>
            )}
          </button>
        )}

        {assessment && (
          <div className={`mt-3 rounded-xl border p-4 animate-slide-down ${
            assessment.severity === 'None'
              ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30'
              : 'border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/20'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className={`h-4 w-4 ${
                  assessment.severity === 'None'
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-primary-600 dark:text-primary-400'
                }`} />
                <span className={`text-sm font-semibold ${
                  assessment.severity === 'None'
                    ? 'text-gray-600 dark:text-gray-400'
                    : 'text-primary-700 dark:text-primary-300'
                }`}>
                  {assessment.severity === 'None' ? 'AI Assessment — No Infrastructure Damage Detected' : 'AI Damage Assessment'}
                </span>
              </div>
              {assessment.severity !== 'None' && (
                <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                  {Math.round(assessment.confidence * 100)}% confidence
                </span>
              )}
            </div>
            {assessment.severity !== 'None' && (
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Severity</span>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{assessment.severity}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Est. Repair Cost</span>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{assessment.estimatedRepairCost}</p>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{assessment.description}</p>
            {assessment.detectedIssues.length > 0 && (
              <div className="space-y-1">
                {assessment.detectedIssues.map((issue, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 text-amber-500 shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <button type="submit" className="btn-primary w-full">
        <CheckCircle2 className="h-4 w-4" /> Submit Complaint
      </button>
    </form>
  );
}
