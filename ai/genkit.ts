import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Get API key from environment variables
// Supports: GEMINI_API_KEY, GOOGLE_API_KEY, or GOOGLE_GENAI_API_KEY
const apiKey = process.env.GEMINI_API_KEY || 
               process.env.GOOGLE_API_KEY || 
               process.env.GOOGLE_GENAI_API_KEY;

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
