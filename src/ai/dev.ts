import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-dispute-context.ts';
import '@/ai/flows/generate-resolution-summary.ts';
import '@/ai/flows/suggest-empathy-prompts.ts';
import '@/ai/flows/analyze-document.ts';
