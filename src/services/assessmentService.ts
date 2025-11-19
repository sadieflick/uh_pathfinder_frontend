// src/services/assessmentService.ts
import apiClient from '@/lib/apiClient';
import { fallbackOccupations } from '@/data/fallbackOccupations';

// --- Types aligned to FastAPI Pydantic models ---

export interface OccupationLite {
  onet_code: string;
  title: string;
  median_salary?: number;
  growth_outlook?: string;
}

export interface SkillDefinition {
  element_id: string;
  name: string;
  question: string;
  easy_read_description: string;
  anchor_first: string;
  anchor_third: string;
  anchor_last: string;
  data_point_20: number;
  data_point_35: number;
  data_point_50: number;
  data_point_65: number;
  data_point_80: number;
}

export interface RiasecResult {
  riasec_code: string;
  occupation_pool: string[];
  top10_jobs: OccupationLite[];
  skills_panel: SkillDefinition[];
}

export interface SkillRatingsSubmission {
  riasec_code: string;
  ratings: Record<string, number>; // element_id -> user rating
}

export interface SkillWeighted {
  element_id: string;
  raw_rating: number;
  normalized_score: number;
  adjusted_weight: number;
}

export interface SkillWeightsResponse {
  riasec_code: string;
  weighted_skills: SkillWeighted[];
  category_weights: Record<string, number>;
}

// --- Helper: compute 3-letter RIASEC from answers ---

const AREA_TO_CODE: Record<string, string> = {
  Realistic: 'R',
  Investigative: 'I',
  Artistic: 'A',
  Social: 'S',
  Enterprising: 'E',
  Conventional: 'C',
};

export interface RiasecAnswerMap {
  [questionIndex: number]: number; // 0-based index -> rating 1..5
}

export interface RiasecQuestion {
  index: number; // 1..30
  area: keyof typeof AREA_TO_CODE;
  text: string;
}

export function computeRiasecCode(
  answers: RiasecAnswerMap,
  questions: RiasecQuestion[],
): string {
  const areaScores: Record<string, number> = {
    Realistic: 0,
    Investigative: 0,
    Artistic: 0,
    Social: 0,
    Enterprising: 0,
    Conventional: 0,
  };
  for (const q of questions) {
    const idx = q.index - 1; // stored 0-based in state
    const val = answers[idx] ?? 3; // default mid if unanswered
    areaScores[q.area] += val;
  }
  const sorted = Object.entries(areaScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([area]) => AREA_TO_CODE[area]);
  return sorted.join('');
}

// --- API functions ---

/**
 * Generate fallback RIASEC result when backend is unavailable
 */
const generateFallbackRiasecResult = (riasecCode: string, limit: number): RiasecResult => {
  // Get a sample of occupations from fallback data
  const allOccupations = Object.values(fallbackOccupations);
  const selectedOccupations = allOccupations.slice(0, Math.min(limit, allOccupations.length));
  
  return {
    riasec_code: riasecCode,
    occupation_pool: selectedOccupations.map(o => o.onet_code),
    top10_jobs: selectedOccupations.map(o => ({
      onet_code: o.onet_code,
      title: o.title,
      median_salary: o.median_salary,
      growth_outlook: o.growth_outlook
    })),
    skills_panel: [] // Skills panel would need its own fallback if needed
  };
};

export const submitRiasecCode = async (riasecCode: string, limit: number = 10): Promise<RiasecResult> => {
  try {
    console.log(`🔍 [API] Submitting RIASEC code: ${riasecCode} with limit: ${limit}`);
    const response = await apiClient.post<RiasecResult>('/assessment/riasec', { riasec_code: riasecCode, limit });
    console.log(`✅ [API] Successfully received ${response.data.top10_jobs.length} matched occupations from backend`);
    return response.data;
  } catch (error) {
    console.warn(`⚠️ [FALLBACK] Backend unavailable for RIASEC assessment, using fallback data for code: ${riasecCode}`);
    return generateFallbackRiasecResult(riasecCode, limit);
  }
};

export const submitSkillWeights = async (
  submission: SkillRatingsSubmission,
): Promise<SkillWeightsResponse> => {
  try {
    const response = await apiClient.post<SkillWeightsResponse>('/assessment/skills/weights', submission);
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable for skill weights, returning empty result');
    // Return empty but valid response
    return {
      riasec_code: submission.riasec_code,
      weighted_skills: [],
      category_weights: {}
    };
  }
};

export const getOccupationDetails = async (onetCode: string) => {
  try {
    const response = await apiClient.get(`/occupations/${onetCode}`);
    return response.data;
  } catch (error) {
    console.warn(`Backend unavailable for occupation ${onetCode}, using fallback data`);
    // Return fallback occupation data
    const fallback = fallbackOccupations[onetCode];
    if (fallback) {
      return {
        onet_code: fallback.onet_code,
        title: fallback.title,
        description: fallback.description,
        median_annual_wage: fallback.median_salary,
        employment_outlook: fallback.growth_outlook,
        job_zone: 3, // Default job zone
        interest_codes: [],
        interest_scores: {},
        onet_url: `https://www.onetonline.org/link/summary/${fallback.onet_code}`
      };
    }
    throw error; // Re-throw if no fallback available
  }
};