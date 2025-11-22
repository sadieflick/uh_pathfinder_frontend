// src/services/occupationService.ts
import apiClient from '@/lib/apiClient';
import { fallbackOccupations, fallbackPrograms } from '@/data/fallbackOccupations';
import { fixProgramEncoding, fixOccupationEncoding } from '@/utils/text';

// --- Types for Occupation and Program data ---

export interface Occupation {
  onet_code: string;
  title: string;
  description: string;
  median_annual_wage: number | null;
  employment_outlook: string;
  job_zone: number;
  interest_codes: string[];
  interest_scores: Record<string, number>;
  onet_url: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  pathway_id: string;
  institution_id: string;
  degree_type: string;
  duration_years: number;
  total_credits: number;
  cost_per_credit: number;
  program_url: string;
  program_links: string[];
  prerequisites: string[];
  delivery_modes: string[];
}

export interface OccupationWithPrograms {
  occupation: Occupation;
  programs: Program[];
  program_count: number;
}

export interface SkillScore {
  element_id: string;
  element_name: string;
  score: number;
}

// --- API Functions ---

/**
 * Get detailed information about a specific occupation by O*NET code.
 * 
 * @param onetCode - The O*NET SOC code (e.g., '51-4041.00')
 * @returns Occupation details
 */
export const getOccupation = async (onetCode: string): Promise<Occupation> => {
  try {
    console.log(`🔍 [API] Fetching occupation: ${onetCode}`);
  const response = await apiClient.get<Occupation>(`/occupations/${onetCode}`);
  console.log(`✅ [API] Successfully fetched occupation from backend:`, response.data.title);
  return fixOccupationEncoding(response.data);
  } catch (error) {
    console.warn(`⚠️ [FALLBACK] Backend unavailable for occupation ${onetCode}, using fallback data`);
    const fallback = fallbackOccupations[onetCode];
    if (!fallback) {
      throw new Error(`Occupation ${onetCode} not found in fallback data`);
    }
    // Convert FallbackOccupation to full Occupation type
    return fixOccupationEncoding({
      ...fallback,
      median_annual_wage: fallback.median_salary,
      employment_outlook: fallback.growth_outlook,
      job_zone: 3, // Default
      interest_codes: [],
      interest_scores: {},
      onet_url: `https://www.onetonline.org/link/summary/${onetCode}`
    });
  }
};

/**
 * Get an occupation along with all its associated programs.
 * 
 * Programs are matched through semantic similarity analysis that maps
 * occupations to relevant University of Hawaii programs via career pathways.
 * 
 * @param onetCode - The O*NET SOC code (e.g., '51-4041.00')
 * @returns Occupation details with associated programs
 */
export const getOccupationWithPrograms = async (
  onetCode: string
): Promise<OccupationWithPrograms> => {
  try {
    console.log(`🔍 [API] Fetching occupation with programs: ${onetCode}`);
    const response = await apiClient.get<OccupationWithPrograms>(
      `/occupations/${onetCode}/programs`
    );
    console.log(`✅ [API] Successfully fetched ${response.data.program_count} programs from backend`);
    return {
      ...response.data,
      occupation: fixOccupationEncoding(response.data.occupation),
      programs: response.data.programs.map(p => fixProgramEncoding(p))
    };
  } catch (error) {
    console.warn(`⚠️ [FALLBACK] Backend unavailable for occupation programs ${onetCode}, using fallback data`);
    const fallbackOcc = fallbackOccupations[onetCode];
    if (!fallbackOcc) {
      throw new Error(`Occupation ${onetCode} not found in fallback data`);
    }
    
    const occupation: Occupation = {
      ...fallbackOcc,
      median_annual_wage: fallbackOcc.median_salary,
      employment_outlook: fallbackOcc.growth_outlook,
      job_zone: 3,
      interest_codes: [],
      interest_scores: {},
      onet_url: `https://www.onetonline.org/link/summary/${onetCode}`
    };
    
    const programs = (fallbackPrograms[onetCode] || []).map(p => fixProgramEncoding(p));
    return {
      occupation: fixOccupationEncoding(occupation),
      programs,
      program_count: programs.length
    };
  }
};

/**
 * Get just the programs associated with an occupation (lightweight).
 * Falls back to mock data if backend is unavailable.
 * 
 * @param onetCode - The O*NET SOC code
 * @returns Array of programs
 */
export const getOccupationPrograms = async (onetCode: string): Promise<Program[]> => {
  try {
    const response = await apiClient.get<Program[]>(
      `/occupations/${onetCode}/programs/summary`
    );
    return response.data.map(p => fixProgramEncoding(p));
  } catch (error) {
    console.warn(`Backend unavailable for programs ${onetCode}, using fallback data`);
    // Return fallback programs if available, otherwise empty array
    return (fallbackPrograms[onetCode] || []).map(p => fixProgramEncoding(p));
  }
};

/**
 * Get top skills (Importance scale) for an occupation.
 * @param onetCode O*NET SOC code
 * @param limit optional limit (default 12)
 */
export const getOccupationTopSkills = async (onetCode: string, limit: number = 5): Promise<SkillScore[]> => {
  try {
    const response = await apiClient.get<SkillScore[]>(`/occupations/${onetCode}/top-skills`, { params: { limit } });
    return response.data;
  } catch (error) {
    console.warn(`⚠️ Backend unavailable for top skills ${onetCode}; returning empty list`);
    return [];
  }
};

/**
 * Get programs for multiple occupations in batch.
 * Useful for loading programs for all occupation recommendations at once.
 * 
 * @param onetCodes - Array of O*NET SOC codes
 * @returns Map of onet_code to programs
 */
export const getMultipleOccupationPrograms = async (
  onetCodes: string[]
): Promise<Record<string, Program[]>> => {
  // Fetch all programs in parallel
  const results = await Promise.allSettled(
    onetCodes.map(code => getOccupationPrograms(code))
  );
  
  // Build result map
  const programsMap: Record<string, Program[]> = {};
  results.forEach((result, index) => {
    const code = onetCodes[index];
    if (result.status === 'fulfilled') {
      programsMap[code] = result.value;
    } else {
      // If fetch failed, return empty array for this occupation
      console.warn(`Failed to fetch programs for ${code}:`, result.reason);
      programsMap[code] = [];
    }
  });
  
  return programsMap;
};

/**
 * Calculate total estimated cost for a program.
 * 
 * @param program - Program object
 * @returns Estimated total cost
 */
export const calculateProgramCost = (program: Program): number => {
  return program.total_credits * program.cost_per_credit;
};

/**
 * Format program duration in human-readable form.
 * 
 * @param durationYears - Duration in years
 * @returns Formatted string (e.g., "2 years", "1.5 years")
 */
export const formatProgramDuration = (durationYears: number): string => {
  if (durationYears === 1) return '1 year';
  return `${durationYears} years`;
};
