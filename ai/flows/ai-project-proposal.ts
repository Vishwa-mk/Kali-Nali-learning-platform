'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a project proposal based on user interests.
 *
 * - aiProjectProposal - A function that triggers the project proposal generation flow.
 * - AIProjectProposalInput - The input type for the aiProjectProposal function.
 * - AIProjectProposalOutput - The return type for the aiProjectProposal function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIProjectProposalInputSchema = z.object({
  userDescription: z
    .string()
    .describe('A description of the users interests and what they want to learn.'),
});
export type AIProjectProposalInput = z.infer<typeof AIProjectProposalInputSchema>;

const AIProjectProposalOutputSchema = z.object({
  projectName: z.string().describe('The name of the proposed project.'),
  projectDescription:
    z.string().describe('A detailed description of the proposed project.'),
  segments: z.array(z.string()).describe('A list of project segments.'),
  requiredSkills: z.array(z.string()).describe('A list of required skills for the project.'),
  progress: z.string().describe('A short, one-sentence summary of the project.'),
});
export type AIProjectProposalOutput = z.infer<typeof AIProjectProposalOutputSchema>;

export async function aiProjectProposal(
  input: AIProjectProposalInput
): Promise<AIProjectProposalOutput> {
  return aiProjectProposalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiProjectProposalPrompt',
  input: {schema: AIProjectProposalInputSchema},
  output: {schema: AIProjectProposalOutputSchema},
  prompt: `You are an AI assistant designed to suggest project ideas to new users based on their interests.

You will generate a project name, project description, project segments, and required skills based on the user's interests.

User Interests: {{{userDescription}}}

Project Name:
Project Description:
Segments:
Required Skills: `,
});

const aiProjectProposalFlow = ai.defineFlow(
  {
    name: 'aiProjectProposalFlow',
    inputSchema: AIProjectProposalInputSchema,
    outputSchema: AIProjectProposalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
