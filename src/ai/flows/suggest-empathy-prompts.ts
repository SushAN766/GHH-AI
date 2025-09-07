// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Provides empathy-prompting phrases for each party in a dispute to enhance communication and understanding.
 *
 * - suggestEmpathyPrompts - A function that suggests empathy prompts for disputing parties.
 * - SuggestEmpathyPromptsInput - The input type for the suggestEmpathyPrompts function.
 * - SuggestEmpathyPromptsOutput - The return type for the suggestEmpathyPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEmpathyPromptsInputSchema = z.object({
  partyAContext: z
    .string()
    .describe('Contextual information about party A and their perspective on the dispute.'),
  partyBContext: z
    .string()
    .describe('Contextual information about party B and their perspective on the dispute.'),
  disputeDetails: z.string().describe('Details of the dispute between party A and party B.'),
});
export type SuggestEmpathyPromptsInput = z.infer<typeof SuggestEmpathyPromptsInputSchema>;

const SuggestEmpathyPromptsOutputSchema = z.object({
  partyAPrompts: z.array(z.string()).describe('Empathy-prompting phrases for party A.'),
  partyBPrompts: z.array(z.string()).describe('Empathy-prompting phrases for party B.'),
});
export type SuggestEmpathyPromptsOutput = z.infer<typeof SuggestEmpathyPromptsOutputSchema>;

export async function suggestEmpathyPrompts(input: SuggestEmpathyPromptsInput): Promise<SuggestEmpathyPromptsOutput> {
  return suggestEmpathyPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEmpathyPromptsPrompt',
  input: {
    schema: SuggestEmpathyPromptsInputSchema,
  },
  output: {
    schema: SuggestEmpathyPromptsOutputSchema,
  },
  prompt: `You are a mediation expert skilled at fostering empathy between disputing parties.

  Based on the dispute details and context provided for each party, suggest several empathy-prompting phrases tailored to each party.
  These prompts should encourage understanding, perspective-taking, and constructive communication.

  Dispute Details: {{{disputeDetails}}}

  Party A Context: {{{partyAContext}}}
  Party B Context: {{{partyBContext}}}

  Format your response as a JSON object with 'partyAPrompts' and 'partyBPrompts' keys. Each key should contain an array of strings.
  `,
});

const suggestEmpathyPromptsFlow = ai.defineFlow(
  {
    name: 'suggestEmpathyPromptsFlow',
    inputSchema: SuggestEmpathyPromptsInputSchema,
    outputSchema: SuggestEmpathyPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
