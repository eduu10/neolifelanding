import type { LeadStatus } from './types';

interface LeadScoreInput {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  goal?: string | null;
  timeframe?: string | null;
  scrollDepth?: number;
  clickedCTA?: boolean;
  timeOnPage?: number;
  isReturning?: boolean;
  isGhost?: boolean;
}

export function calculateLeadScore(input: LeadScoreInput): number {
  let score = 0;

  if (input.name) score += 10;
  if (input.email) score += 20;
  if (input.phone) score += 25;
  if (input.location) score += 10;
  if (input.goal) score += 15;

  if (input.timeframe === 'imediato') score += 20;
  else if (input.timeframe === '3meses') score += 15;
  else if (input.timeframe === '6meses') score += 10;
  else if (input.timeframe === 'planejamento') score += 5;

  if (input.scrollDepth && input.scrollDepth >= 75) score += 5;
  if (input.clickedCTA) score += 5;
  if (input.timeOnPage && input.timeOnPage > 180) score += 5;
  if (input.isReturning) score += 10;
  if (input.isGhost) score -= 15;

  return Math.max(0, Math.min(100, score));
}

export function classifyLead(fieldsCount: number, hasPhone: boolean): LeadStatus {
  if (fieldsCount >= 3 || hasPhone) return 'hot';
  if (fieldsCount >= 1) return 'warm';
  return 'cold';
}

export function countFilledFields(data: Record<string, unknown>): number {
  const fields = ['name', 'email', 'phone', 'location', 'goal', 'timeframe'];
  return fields.filter(f => data[f] && String(data[f]).trim().length > 0).length;
}
