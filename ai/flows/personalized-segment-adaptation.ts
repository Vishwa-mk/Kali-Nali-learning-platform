'use server';

/**
 * @fileOverview A flow for adapting project segments based on learner performance and interactions.
 *
 * - personalizedSegmentAdaptation - A function that adapts project segments based on learner data.
 * - PersonalizedSegmentAdaptationInput - The input type for the personalizedSegmentAdaptation function.
 * - PersonalizedSegmentAdaptationOutput - The return type for the personalizedSegmentAdaptation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedSegmentAdaptationInputSchema = z.object({
  learnerSkills: z
    .array(z.string())
    .describe('The current skills of the learner.'),
  learnerPreferences: z
    .string()
    .describe('The learning preferences of the learner, e.g., visual, auditory, kinesthetic.'),
  projectDescription: z
    .string()
    .describe('The description of the overall project the learner is working on.'),
  currentSegment: z.string().describe('The current project segment the learner is on.'),
  pastAttempts: z
    .array(z.string())
    .describe('Details of past attempts on project segments, including successes and failures.'),
  segmentSuggestions: z
    .array(z.string())
    .describe('A list of suggested project segments to adapt from.'),
  feedback: z.string().describe('Feedback on the learner from teachers and the system.'),
});
export type PersonalizedSegmentAdaptationInput = z.infer<
  typeof PersonalizedSegmentAdaptationInputSchema
>;

const PersonalizedSegmentAdaptationOutputSchema = z.object({
  adaptedSegments: z
    .array(z.string())
    .describe(
      'A list of adapted project segments that align with the learner skills and preferences, and adjusts difficulty and content based on performance.'
    ),
  explanation: z
    .string()
    .describe('An explanation of why these segments were adapted in this way.'),
  progress: z.string().describe('A one-sentence summary of the adaptation process.'),
});
export type PersonalizedSegmentAdaptationOutput = z.infer<
  typeof PersonalizedSegmentAdaptationOutputSchema
>;

export async function personalizedSegmentAdaptation(
  input: PersonalizedSegmentAdaptationInput
): Promise<PersonalizedSegmentAdaptationOutput> {
  return personalizedSegmentAdaptationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedSegmentAdaptationPrompt',
  input: {schema: PersonalizedSegmentAdaptationInputSchema},
  output: {schema: PersonalizedSegmentAdaptationOutputSchema},
  prompt: `You are an expert learning assistant that specializes in adapting project segments for learners based on their performance, skills, preferences, and feedback.

You will consider the learner's existing skills, learning preferences, the overall project description, the current segment they are on, their past attempts, a list of suggested segments, and any feedback received to adapt the segments for them.

Learner Skills: {{{learnerSkills}}}
Learner Preferences: {{{learnerPreferences}}}
Project Description: {{{projectDescription}}}
Current Segment: {{{currentSegment}}}
Past Attempts: {{{pastAttempts}}}
Segment Suggestions: {{#each segmentSuggestions}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Feedback: {{{feedback}}}

Based on this information, adapt the suggested project segments to best suit the learner's current needs and abilities. Explain why you have adapted the segments in this way.

Adapted Segments:
Explanation:
Progress:
`,
});

const personalizedSegmentAdaptationFlow = ai.defineFlow(
  {
    name: 'personalizedSegmentAdaptationFlow',
    inputSchema: PersonalizedSegmentAdaptationInputSchema,
    outputSchema: PersonalizedSegmentAdaptationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
