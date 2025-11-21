'use server';

/**
 * @fileOverview A flow for providing personalized project segment suggestions to learners based on their skill level and learning preferences.
 *
 * - personalizedSegmentSuggestions - A function that generates personalized project segment suggestions.
 * - PersonalizedSegmentSuggestionsInput - The input type for the personalizedSegmentSuggestions function.
 * - PersonalizedSegmentSuggestionsOutput - The return type for the personalizedSegmentSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedSegmentSuggestionsInputSchema = z.object({
  learnerSkills: z
    .array(z.string())
    .describe('The current skills of the learner.'),
  learnerPreferences: z
    .string()
    .describe('The learning preferences of the learner, e.g., visual, auditory, kinesthetic.'),
  projectDescription: z
    .string()
    .describe('The description of the overall project the learner is working on.'),
  currentSegment: z.string().describe('The current project segment the learner is on, if any.'),
  pastAttempts: z
    .array(z.string())
    .describe('Details of past attempts on project segments, including successes and failures.'),
});
export type PersonalizedSegmentSuggestionsInput = z.infer<
  typeof PersonalizedSegmentSuggestionsInputSchema
>;

const PersonalizedSegmentSuggestionsOutputSchema = z.object({
  suggestedSegments: z
    .array(z.string())
    .describe(
      'A list of suggested project segments that align with the learner skills and preferences.'
    ),
  explanation: z
    .string()
    .describe('An explanation of why these segments were suggested.'),
});
export type PersonalizedSegmentSuggestionsOutput = z.infer<
  typeof PersonalizedSegmentSuggestionsOutputSchema
>;

export async function personalizedSegmentSuggestions(
  input: PersonalizedSegmentSuggestionsInput
): Promise<PersonalizedSegmentSuggestionsOutput> {
  return personalizedSegmentSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedSegmentSuggestionsPrompt',
  input: {schema: PersonalizedSegmentSuggestionsInputSchema},
  output: {schema: PersonalizedSegmentSuggestionsOutputSchema},
  prompt: `You are an expert learning assistant that specializes in suggesting project segments to learners.

You will consider the learner's existing skills, learning preferences, the overall project description, the current segment they are on (if any), and their past attempts to suggest the next best segments for them to work on.

Learner Skills: {{{learnerSkills}}}
Learner Preferences: {{{learnerPreferences}}}
Project Description: {{{projectDescription}}}
Current Segment: {{{currentSegment}}}
Past Attempts: {{{pastAttempts}}}

Based on this information, suggest project segments that align with the learner's skill level and preferences, so they can focus on areas where they need the most improvement and stay engaged.

{{output}}
`,
});

const personalizedSegmentSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedSegmentSuggestionsFlow',
    inputSchema: PersonalizedSegmentSuggestionsInputSchema,
    outputSchema: PersonalizedSegmentSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
