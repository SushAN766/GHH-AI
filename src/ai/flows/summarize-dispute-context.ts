'use server';

/**
 * @fileOverview Summarizes the dispute in a culturally sensitive manner, highlighting areas of agreement and disagreement.
 *
 * - summarizeDisputeContext - A function that handles the dispute context summarization process.
 * - SummarizeDisputeContextInput - The input type for the summarizeDisputeContext function.
 * - SummarizeDisputeContextOutput - The return type for the summarizeDisputeContext function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDisputeContextInputSchema = z.object({
  disputeDetails: z
    .string()
    .describe('Comprehensive details of the dispute, including all relevant facts and perspectives.'),
  culturalContext:
    z.string().describe('The cultural context of the involved parties.'),
  jurisdictionalContext:
    z.string().describe('The relevant jurisdictional context of the dispute.'),
});
export type SummarizeDisputeContextInput = z.infer<
  typeof SummarizeDisputeContextInputSchema
>;

const SummarizeDisputeContextOutputSchema = z.object({
  summary: z.string().describe(
    'A culturally sensitive summary of the dispute, highlighting areas of agreement and disagreement.'
  ),
});
export type SummarizeDisputeContextOutput = z.infer<
  typeof SummarizeDisputeContextOutputSchema
>;

export async function summarizeDisputeContext(
  input: SummarizeDisputeContextInput
): Promise<SummarizeDisputeContextOutput> {
  return summarizeDisputeContextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDisputeContextPrompt',
  input: {schema: SummarizeDisputeContextInputSchema},
  output: {schema: SummarizeDisputeContextOutputSchema},
  prompt: `You are an expert in dispute resolution, skilled in understanding cultural nuances and jurisdictional rules.

  Given the following details about a dispute, provide a summary that is culturally sensitive and highlights the areas of agreement and disagreement. The summary should be easily understandable and neutral. Take into account the cultural and jurisdictional contexts to avoid misunderstandings and biases.

  Dispute Details: {{{disputeDetails}}}
  Cultural Context: {{{culturalContext}}}
  Jurisdictional Context: {{{jurisdictionalContext}}}

  Summary:`,
});

const summarizeDisputeContextFlow = ai.defineFlow(
  {
    name: 'summarizeDisputeContextFlow',
    inputSchema: SummarizeDisputeContextInputSchema,
    outputSchema: SummarizeDisputeContextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
