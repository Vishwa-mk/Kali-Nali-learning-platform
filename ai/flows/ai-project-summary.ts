'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a concise summary of a project's progress and key learnings.
 *
 * - aiProjectSummary - A function that triggers the project summary generation flow.
 * - AIProjectSummaryInput - The input type for the aiProjectSummary function.
 * - AIProjectSummaryOutput - The return type for the aiProjectSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIProjectSummaryInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  projectDescription: z.string().describe('A detailed description of the project.'),
  completedSegments: z
    .array(z.string())
    .describe('A list of completed segments in the project.'),
  keyLearnings: z.string().describe('A summary of the key learnings from the project.'),
});
export type AIProjectSummaryInput = z.infer<typeof AIProjectSummaryInputSchema>;

const AIProjectSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the project progress and key learnings.'),
  progress: z.string().describe('A short, one-sentence summary of the project.'),
});
export type AIProjectSummaryOutput = z.infer<typeof AIProjectSummaryOutputSchema>;

export async function aiProjectSummary(input: AIProjectSummaryInput): Promise<AIProjectSummaryOutput> {
  return aiProjectSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiProjectSummaryPrompt',
  input: {schema: AIProjectSummaryInputSchema},
  output: {schema: AIProjectSummaryOutputSchema},
  prompt: `You are an AI assistant designed to provide concise summaries of project progress and key learnings.

  Project Name: {{{projectName}}}
  Project Description: {{{projectDescription}}}
  Completed Segments: {{#each completedSegments}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Key Learnings: {{{keyLearnings}}}

  Please generate a concise summary of the project's progress and key learnings, highlighting accomplishments.
  The summary should be no more than three sentences.
  Also, generate a one sentence summary of the progress in the 'progress' field.
  `,
});

const aiProjectSummaryFlow = ai.defineFlow(
  {
    name: 'aiProjectSummaryFlow',
    inputSchema: AIProjectSummaryInputSchema,
    outputSchema: AIProjectSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
