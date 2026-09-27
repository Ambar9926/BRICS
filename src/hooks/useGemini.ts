import type { DamageAssessment } from '@/types';

/**
 * Gemini API integration layer.
 *
 * This module provides modular hooks and functions for connecting to the
 * Gemini API. To activate, set VITE_GEMINI_API_KEY in your .env file.
 *
 * The functions below work in two modes:
 * 1. Mock mode (default): Returns simulated responses for UI development.
 * 2. Live mode: Calls Gemini API endpoints when an API key is present.
 *
 * Integration points:
 * - Gemini Vision: Photo damage assessment (analyzeInfrastructurePhoto)
 * - Gemini Flash: NLP / translation / BRICS AI assistant (chatWithBRICSAI, translateText)
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const GEMINI_VISION_MODEL = 'gemini-3.5-flash';
const GEMINI_FLASH_MODEL = 'gemini-3.5-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

function isLiveMode(): boolean {
  return !!GEMINI_API_KEY;
}

const MAX_RETRIES = 2;

async function geminiFetch(model: string, body: Record<string, unknown>): Promise<Response> {
  const url = `${GEMINI_BASE_URL}/${model}:generateContent?key=${GEMINI_API_KEY}`;
  let lastError = '';
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) return res;
    if (res.status === 503 && attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      continue;
    }
    const errBody = await res.text();
    lastError = `Gemini API ${res.status}: ${errBody}`;
    break;
  }
  throw new Error(lastError);
}

// ─── Photo Damage Assessment (Gemini Vision) ───

interface PhotoAnalysisResult {
  assessment: DamageAssessment;
  rawResponse?: string;
}

function extractJson(text: string): string {
  let cleaned = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    cleaned = cleaned.substring(start, end + 1);
  }
  return cleaned;
}

function normalizeSeverity(raw: string): DamageAssessment['severity'] {
  const s = raw?.toLowerCase()?.trim();
  if (s === 'critical') return 'Critical';
  if (s === 'severe') return 'Severe';
  if (s === 'moderate') return 'Moderate';
  if (s === 'minor') return 'Minor';
  return 'None';
}

function parseAssessment(text: string): DamageAssessment {
  const jsonStr = extractJson(text);
  const obj = JSON.parse(jsonStr);
  return {
    severity: normalizeSeverity(obj.severity),
    confidence: typeof obj.confidence === 'number' ? Math.max(0, Math.min(1, obj.confidence)) : 0,
    description: typeof obj.description === 'string' ? obj.description : '',
    detectedIssues: Array.isArray(obj.detectedIssues) ? obj.detectedIssues.filter((i: unknown) => typeof i === 'string') : [],
    estimatedRepairCost: typeof obj.estimatedRepairCost === 'string' ? obj.estimatedRepairCost : 'Not applicable',
  };
}

export async function analyzeInfrastructurePhoto(
  photoBase64: string,
  mimeType: string,
  context?: string,
): Promise<PhotoAnalysisResult> {
  if (isLiveMode()) {
    const prompt = `You are an expert infrastructure damage assessor. You will be shown a photo that a citizen uploaded with an infrastructure complaint.

Your job is to carefully examine the image and identify what is actually visible.

STEP 1 — Identify what is in the image:
Is this a photo of infrastructure such as a road, bridge, building, pipe, power line, water facility, drainage, or similar? Or is it a landscape, a person, an animal, scenery, food, or something unrelated to infrastructure?

STEP 2 — If it IS infrastructure, look for visible damage:
- Cracks, potholes, erosion, subsidence, structural deformation
- Water leakage, flooding, corrosion, staining
- Broken components, exposed rebar, collapsed sections
- Fire damage, electrical damage, vegetation overgrowth causing damage
Assess the severity of what you actually see.

STEP 3 — If it is NOT infrastructure or shows no visible damage:
Return severity "None" with a clear explanation. Do NOT invent damage that is not visible.

Be balanced: If you see a broken road with potholes, report it as damaged. If you see a clean intact road, report no damage. If you see a person or scenery, report that no infrastructure is visible.

${context ? `Citizen's report context (use as background only, assess the IMAGE itself): ${context}` : ''}

Return ONLY valid JSON in this exact format:
{"severity": "None" | "Minor" | "Moderate" | "Severe" | "Critical", "confidence": 0.0-1.0, "description": "what you see in the image", "detectedIssues": ["list of visible issues"], "estimatedRepairCost": "cost range or Not applicable"}`;

    const response = await geminiFetch(GEMINI_VISION_MODEL, {
      contents: [
        {
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: photoBase64 } },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        topP: 0.95,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Gemini API ${response.status}: ${errBody}`);
    }
    const data = await response.json();

    if (data.promptFeedback?.blockReason) {
      throw new Error(`Blocked: ${data.promptFeedback.blockReason}`);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    const assessment = parseAssessment(text);
    return { assessment, rawResponse: text };
  }

  // Demo mode cannot inspect image pixels, so it must not claim damage.
  await new Promise((r) => setTimeout(r, 800));
  return {
    assessment: {
      severity: 'None',
      confidence: 0,
      description: 'Live image analysis is not enabled. Add a Gemini API key to verify visible infrastructure damage.',
      detectedIssues: [],
      estimatedRepairCost: 'Not applicable',
    },
  };
}

// ─── BRICS AI Assistant (Gemini Flash NLP) ───

interface ChatResponse {
  content: string;
  language?: string;
}

export async function chatWithBRICSAI(
  message: string,
  history: { role: string; content: string }[],
  language: string = 'en',
): Promise<ChatResponse> {
  if (isLiveMode()) {
    const systemPrompt = `You are "BRICS AI Assistant", part of the BRICS Infrastructure Demand AI platform. You help citizens report infrastructure issues across BRICS nations (India, Brazil, Russia, China, South Africa).

Your role:
- Help citizens describe their infrastructure complaints clearly
- Categorize issues into: Transport, Water, Energy, Sanitation, Digital, Housing, Healthcare
- Suggest appropriate priority levels based on severity
- Guide users on what information to include (location, photos, impact)
- Respond in the user's language when possible
- Be concise, empathetic, and action-oriented

Respond in language code: ${language}`;

    const contents = [
      ...history.map((h) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await geminiFetch(GEMINI_FLASH_MODEL, {
      contents,
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return { content: text, language };
  }

  // Mock response
  await new Promise((r) => setTimeout(r, 1200));
  const lower = message.toLowerCase();

  if (lower.includes('road') || lower.includes('pothole') || lower.includes('bridge')) {
    return {
      content:
        'I can see you are reporting a road/transport issue. To file this complaint effectively, please provide:\n\n1. **Exact location** (road name, nearest landmark)\n2. **Nature of damage** (potholes, cracks, bridge damage)\n3. **Impact** (accidents, traffic delays, vehicle damage)\n4. **A photo** if possible — our AI can assess severity automatically\n\nBased on your description, I would categorize this as **Transport** with a suggested priority of **High**. Would you like to proceed with filing this report?',
      language,
    };
  }

  if (lower.includes('water') || lower.includes('sewage') || lower.includes('drain')) {
    return {
      content:
        'Water or sanitation issue detected. These are often high-priority due to public health risks. Please share:\n\n1. **Affected area** and approximate number of people impacted\n2. **Duration** of the problem (hours, days, ongoing)\n3. **Any health symptoms** reported by residents\n4. **A photo** of the affected water/drainage\n\nI recommend categorizing this as **Water/Sanitation** with priority **Critical** if health risks are present.',
      language,
    };
  }

  if (lower.includes('power') || lower.includes('electric') || lower.includes('outage')) {
    return {
      content:
        'Energy infrastructure issue noted. Power outages can impact healthcare, education, and businesses. Please provide:\n\n1. **Affected neighborhood** and estimated households\n2. **Frequency and duration** of outages\n3. **Critical facilities affected** (hospitals, schools, water pumps)\n\nI suggest categorizing as **Energy** with priority **High**.',
      language,
    };
  }

  return {
    content:
      'Thank you for reaching out! I am here to help you report infrastructure issues in your community. \n\nYou can describe the problem (e.g., road damage, water contamination, power outages, digital connectivity gaps), and I will:\n- Help categorize the issue\n- Suggest a priority level\n- Guide you on providing the right details\n- Help you attach a photo for AI damage assessment\n\nWhat infrastructure issue would you like to report today?',
    language,
  };
}

// ─── Translation (Gemini Flash) ───

export async function translateText(
  text: string,
  targetLanguage: string,
): Promise<string> {
  if (isLiveMode()) {
    const response = await geminiFetch(GEMINI_FLASH_MODEL, {
      contents: [
        {
          parts: [
            {
              text: `Translate the following text to ${targetLanguage}. Only return the translation, nothing else.\n\n${text}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    });

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || text;
  }

  // Mock: return original text
  return text;
}

// ─── Smart Budget Allocation (Gemini Flash) ───

export interface BudgetSuggestion {
  category: string;
  percentage: number;
  reasoning: string;
  impactEstimate: string;
}

export async function getSmartBudgetAllocation(
  totalBudget: number,
  country: string,
  priorityData: Record<string, number>,
): Promise<BudgetSuggestion[]> {
  if (isLiveMode()) {
    const prompt = `You are an infrastructure budget allocation advisor for BRICS nations. Given a total budget of $${totalBudget.toLocaleString()} for ${country}, and the following priority distribution by category:

${JSON.stringify(priorityData, null, 2)}

Recommend optimal budget allocation across categories: Transport, Water, Energy, Sanitation, Digital, Housing, Healthcare.

Return JSON array:
[
  { "category": "...", "percentage": number, "reasoning": "...", "impactEstimate": "..." }
]

Percentages must sum to 100. Consider urgency, population impact, and long-term resilience.`;

    const response = await geminiFetch(GEMINI_FLASH_MODEL, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    });

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return JSON.parse(text.replace(/```json\n?/g, '').replace(/```/g, ''));
  }

  // Mock: calculate based on priority weights
  await new Promise((r) => setTimeout(r, 1000));
  const total = Object.values(priorityData).reduce((a, b) => a + b, 0) || 1;
  const suggestions: BudgetSuggestion[] = Object.entries(priorityData).map(([cat, val]) => ({
    category: cat,
    percentage: Math.round((val / total) * 100),
    reasoning: `${cat} accounts for ${Math.round((val / total) * 100)}% of active critical and high-priority complaints in ${country}. Allocating proportionally addresses the most urgent citizen demands while maintaining balanced infrastructure development.`,
    impactEstimate: `Projected to resolve ~${Math.round(val * 3.2)} active complaints and impact approximately ${(val * 1200).toLocaleString()} citizens.`,
  }));

  return suggestions;
}

export function isGeminiLive(): boolean {
  return isLiveMode();
}
