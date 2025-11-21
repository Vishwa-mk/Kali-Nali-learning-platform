'use server';

/**
 * @fileOverview Adaptive hint generation flow using Google Gemini model directly.
 * Generates concise 15-20 word hints based on learner's specific solution attempts.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptiveHintGenerationInputSchema = z.object({
  projectSegmentDescription: z
    .string()
    .describe('The description of the current project segment.'),
  learnerActions: z
    .string()
    .describe("A description of the learner's recent actions and attempts."),
  learnerUnderstanding: z
    .string()
    .describe("An assessment of the learner's current understanding of the concepts involved."),
  hintRequest: z
    .string()
    .describe('A specific request or question from the learner seeking a hint.'),
});
export type AdaptiveHintGenerationInput = z.infer<typeof AdaptiveHintGenerationInputSchema>;

const AdaptiveHintGenerationOutputSchema = z.object({
  hint: z.string().describe('A tailored hint to help the learner overcome the challenge (15-20 words).'),
  explanation: z.string().describe('An explanation of the hint and related concepts.'),
  progress: z.string().describe('A short, one-sentence summary of the hint generation.'),
});
export type AdaptiveHintGenerationOutput = z.infer<typeof AdaptiveHintGenerationOutputSchema>;

export async function generateAdaptiveHint(
  input: AdaptiveHintGenerationInput
): Promise<AdaptiveHintGenerationOutput> {
  return adaptiveHintGenerationFlow(input);
}

// Define prompt using Gemini model (uses default model from genkit config)
const adaptiveHintGenerationPrompt = ai.definePrompt({
  name: 'adaptiveHintGenerationPrompt',
  input: {schema: AdaptiveHintGenerationInputSchema},
  output: {schema: AdaptiveHintGenerationOutputSchema},
  prompt: `You are an expert coding tutor. Analyze the learner's solution attempt and provide a precise, targeted hint.

Project Segment: {{{projectSegmentDescription}}}
Learner's Solution Attempt: {{{learnerActions}}}
Learner Understanding: {{{learnerUnderstanding}}}
Hint Request: {{{hintRequest}}}

CRITICAL: Generate a hint that is EXACTLY 15-20 words. Count your words carefully. The hint must directly address what's wrong, missing, or needs improvement in their SPECIFIC solution attempt. Be actionable and specific.

Return your response with:
- hint: Exactly 15-20 words addressing their specific solution
- explanation: Brief 2-3 sentence explanation`,
});

const adaptiveHintGenerationFlow = ai.defineFlow(
  {
    name: 'adaptiveHintGenerationFlow',
    inputSchema: AdaptiveHintGenerationInputSchema,
    outputSchema: AdaptiveHintGenerationOutputSchema,
  },
  async input => {
    try {
      const {output} = await adaptiveHintGenerationPrompt(input);
      
      if (!output) {
        throw new Error('No output from model');
      }

      let hintText = output.hint || '';
      let explanationText = output.explanation || '';

      // Enforce 15-20 word limit on hint
      if (hintText) {
        const words = hintText.split(/\s+/).filter(w => w.length > 0);
        if (words.length > 20) {
          hintText = words.slice(0, 20).join(' ');
        } else if (words.length < 15 && words.length > 0) {
          // If too short, keep it but note it's acceptable if reasonable
          hintText = words.join(' ');
        }
      }

      // Fallback if hint is missing or too short
      if (!hintText || hintText.trim().length < 10) {
        hintText = 'Review your code carefully and check the key concepts from the instructions.';
      }

      if (!explanationText) {
        explanationText = 'This hint addresses specific issues in your solution attempt. Review the key concepts mentioned.';
      }

      return {
        hint: hintText,
        explanation: explanationText,
        progress: "Hint generated based on your specific solution attempt.",
      };
    } catch (error: any) {
      console.error('Error generating hint:', error);
      console.error('Error details:', error?.message, error?.stack);
      return {
        hint: 'Review your code and check the key concepts mentioned in the instructions carefully.',
        explanation: `Unable to generate a personalized hint at this time. ${error?.message || 'Please review the segment instructions and try again.'}`,
        progress: "Hint generation encountered an error.",
      };
    }
  }
);
