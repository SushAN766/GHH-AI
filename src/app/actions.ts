'use server';

import {
  summarizeDisputeContext,
  type SummarizeDisputeContextInput,
} from '@/ai/flows/summarize-dispute-context';
import {
  generateResolutionSummary,
  type GenerateResolutionSummaryInput,
} from '@/ai/flows/generate-resolution-summary';
import {
  suggestEmpathyPrompts,
  type SuggestEmpathyPromptsInput,
} from '@/ai/flows/suggest-empathy-prompts';
import {
  analyzeDocument,
  type AnalyzeDocumentInput,
} from '@/ai/flows/analyze-document';

export async function invokeSummarizeDisputeContext(input: SummarizeDisputeContextInput) {
  try {
    const result = await summarizeDisputeContext(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in summarizeDisputeContext flow:', error);
    return { success: false, error: 'Failed to generate dispute summary.' };
  }
}

export async function invokeGenerateResolutionSummary(input: GenerateResolutionSummaryInput) {
  try {
    const result = await generateResolutionSummary(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in generateResolutionSummary flow:', error);
    return { success: false, error: 'Failed to generate resolution summary.' };
  }
}

export async function invokeSuggestEmpathyPrompts(input: SuggestEmpathyPromptsInput) {
  try {
    const result = await suggestEmpathyPrompts(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in suggestEmpathyPrompts flow:', error);
    return { success: false, error: 'Failed to suggest empathy prompts.' };
  }
}

export async function invokeAnalyzeDocument(input: AnalyzeDocumentInput) {
  try {
    const result = await analyzeDocument(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in analyzeDocument flow:', error);
    return { success: false, error: 'Failed to analyze document.' };
  }
}
