'use server';

import { generateAdaptiveHint } from '@/ai/flows/adaptive-hint-generation';
import type { Segment } from '@/lib/types';

export async function getHintAction(segment: Segment, solutionAttempt: string) {
  try {
    const hint = await generateAdaptiveHint({
      projectSegmentDescription: segment.description,
      learnerActions: solutionAttempt,
      learnerUnderstanding: 'Beginner, struggling with the basic implementation.',
      hintRequest: 'I am stuck and need a hint to proceed.',
    });
    return hint;
  } catch (error) {
    console.error(error);
    return {
        hint: 'Could not generate a hint at this time.',
        explanation: 'An error occurred while communicating with the AI. Please try again later.'
    };
  }
}
