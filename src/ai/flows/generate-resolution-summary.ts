'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating resolution summaries that are easily understandable and jurisdiction-aware.
 *
 * - generateResolutionSummary - A function that generates a resolution summary based on the input.
 * - GenerateResolutionSummaryInput - The input type for the generateResolutionSummary function.
 * - GenerateResolutionSummaryOutput - The return type for the generateResolutionSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResolutionSummaryInputSchema = z.object({
  disputeDetails: z
    .string()
    .describe('Detailed information about the dispute.'),
  suggestedResolutions: z
    .string()
    .describe('Suggested resolutions for the dispute.'),
  jurisdiction: z.string().describe('The relevant legal jurisdiction.'),
  culturalContext: z
    .string()
    .describe('Cultural context relevant to the dispute.'),
});
export type GenerateResolutionSummaryInput = z.infer<
  typeof GenerateResolutionSummaryInputSchema
>;

const GenerateResolutionSummaryOutputSchema = z.object({
  resolutionSummary: z
    .string()
    .describe(
      'A summary of the suggested resolutions, incorporating jurisdiction-aware practices and cultural sensitivity.'
    ),
});
export type GenerateResolutionSummaryOutput = z.infer<
  typeof GenerateResolutionSummaryOutputSchema
>;

export async function generateResolutionSummary(
  input: GenerateResolutionSummaryInput
): Promise<GenerateResolutionSummaryOutput> {
  return generateResolutionSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResolutionSummaryPrompt',
  input: {schema: GenerateResolutionSummaryInputSchema},
  output: {schema: GenerateResolutionSummaryOutputSchema},
  prompt: `You are an expert mediator, skilled in creating understandable summaries of suggested resolutions that incorporate jurisdiction-aware practices.

  Given the following dispute details, suggested resolutions, jurisdiction, and cultural context, generate a clear and concise resolution summary.

  Dispute Details: {{{disputeDetails}}}
  Suggested Resolutions: {{{suggestedResolutions}}}
  Jurisdiction: {{{jurisdiction}}}
  Cultural Context: {{{culturalContext}}}

  Resolution Summary:`,
});

const generateResolutionSummaryFlow = ai.defineFlow(
  {
    name: 'generateResolutionSummaryFlow',
    inputSchema: GenerateResolutionSummaryInputSchema,
    outputSchema: GenerateResolutionSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
