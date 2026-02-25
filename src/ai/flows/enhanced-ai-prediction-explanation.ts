'use server';
/**
 * @fileOverview A Genkit flow for predicting SicBo outcomes and explaining the reasoning.
 *
 * - enhancedAIPredictionExplanation - A function that takes game history and returns predictions with explanations.
 * - EnhancedAIPredictionInput - The input type for the enhancedAIPredictionExplanation function.
 * - EnhancedAIPredictionOutput - The return type for the enhancedAIPredictionExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HistoryItemSchema = z.object({
  round: z.number().describe('Round number.'),
  d1: z.number().min(1).max(6).describe('Result of dice 1.'),
  d2: z.number().min(1).max(6).describe('Result of dice 2.'),
  d3: z.number().min(1).max(6).describe('Result of dice 3.'),
  sum: z.number().describe('Sum of the three dice.'),
  isB: z.boolean().describe('True if sum is BIG (11-17).'),
  isS: z.boolean().describe('True if sum is SMALL (4-10).'),
  isO: z.boolean().describe('True if sum is ODD.'),
  isE: z.boolean().describe('True if sum is EVEN.'),
  isL: z.boolean().describe('True if it is a LEOPARD (three identical dice).'),
}).describe('A single record of a SicBo game round outcome.');

const EnhancedAIPredictionInputSchema = z.object({
  history: z.array(HistoryItemSchema).max(10).describe('Recent game history, up to the last 10 rounds, used for AI analysis.'),
}).describe('Input for the enhanced AI prediction flow, containing recent game history.');
export type EnhancedAIPredictionInput = z.infer<typeof EnhancedAIPredictionInputSchema>;

const EnhancedAIPredictionOutputSchema = z.object({
  bigSmall: z.enum(['BIG', 'SMALL']).describe('AI prediction for the next round: BIG or SMALL.'),
  oddEven: z.enum(['ODD', 'EVEN']).describe('AI prediction for the next round: ODD or EVEN.'),
  leopardChance: z.enum(['Rendah', 'Sedang', 'Tinggi', 'Sangat Tinggi (Puncak)']).describe('AI prediction for the chance of a LEOPARD in the next round.'),
  confidence: z.number().min(0).max(100).describe('Confidence level of the AI prediction (0-100%).'),
  explanation: z.string().describe('Natural language explanation of the AI reasoning for the predictions, based on historical patterns and heuristics.'),
}).describe('Output from the enhanced AI prediction flow, including predictions and an explanation.');
export type EnhancedAIPredictionOutput = z.infer<typeof EnhancedAIPredictionOutputSchema>;

const PromptInputSchema = z.object({
  historyJson: z.string().describe('JSON string representation of the recent game history.'),
  historyLength: z.number().describe('Number of records in the history.'),
});

const enhancedAIPredictionPrompt = ai.definePrompt({
  name: 'enhancedAIPredictionPrompt',
  input: { schema: PromptInputSchema },
  output: { schema: EnhancedAIPredictionOutputSchema },
  prompt: `You are an expert SicBo predictor. Your task is to analyze the provided game history and predict the next dice roll outcomes for BIG/SMALL, ODD/EVEN, and the chance of a LEOPARD. Additionally, you must provide a natural language explanation for your reasoning, considering historical patterns and common heuristics.

SicBo Rules:
- A sum of 4-10 is SMALL.
- A sum of 11-17 is BIG.
- A sum is ODD if it's not divisible by 2.
- A sum is EVEN if it is divisible by 2.
- A LEOPARD occurs if all three dice show the same number (e.g., 1-1-1, 6-6-6). Sums of 3 or 18 are always Leopards.

Heuristics to apply for prediction and explanation:
1.  **Recent Trends/Streaks**: Identify current streaks (consecutive identical outcomes) for BIG/SMALL and ODD/EVEN in the most recent history.
2.  **BIG/SMALL Prediction**:
    *   If there is a streak of 3 or more consecutive BIGs, predict SMALL (mean reversion).
    *   If there is a streak of 3 or more consecutive SMALLs, predict BIG (mean reversion).
    *   Otherwise, if the most recent outcome is BIG, predict BIG.
    *   Otherwise, if the most recent outcome is SMALL, predict SMALL.
3.  **ODD/EVEN Prediction**:
    *   If there is a streak of 3 or more consecutive ODDs, predict EVEN (mean reversion).
    *   If there is a streak of 3 or more consecutive EVENs, predict ODD (mean reversion).
    *   Otherwise, if the most recent outcome is ODD, predict ODD.
    *   Otherwise, if the most recent outcome is EVEN, predict EVEN.
4.  **LEOPARD Chance**:
    *   Count the number of non-LEOPARD rounds since the most recent LEOPARD in the provided history. Let this be 'roundsSinceLastLeopard'. If no LEOPARD appears in the history, consider 'roundsSinceLastLeopard' to be high (e.g., greater than 15).
    *   'Rendah' (Low) if 'roundsSinceLastLeopard' is 0-4.
    *   'Sedang' (Medium) if 'roundsSinceLastLeopard' is 5-8.
    *   'Tinggi' (High) if 'roundsSinceLastLeopard' is 9-15.
    *   'Sangat Tinggi (Puncak)' (Very High/Peak) if 'roundsSinceLastLeopard' is more than 15.
5.  **Confidence**: Assign a confidence level (0-100%).
    *   For BIG/SMALL and ODD/EVEN, confidence can be higher if the pattern is clear (e.g., a strong streak leading to a mean reversion prediction, or a consistent trend).
    *   For LEOPARD, confidence should reflect the calculated 'chance' level.
    *   If history is very short (e.g., less than 3 rounds), confidence should be low.

Game History (last {{historyLength}} rounds):
{{#if historyLength}}
{{{historyJson}}}
{{else}}
No recent history available.
{{/if}}

Analyze this history and provide your prediction and a concise natural language explanation for each prediction. The explanation should detail the patterns observed and the heuristic rules applied.`,
});

const enhancedAIPredictionExplanationFlow = ai.defineFlow(
  {
    name: 'enhancedAIPredictionExplanationFlow',
    inputSchema: EnhancedAIPredictionInputSchema,
    outputSchema: EnhancedAIPredictionOutputSchema,
  },
  async (input): Promise<EnhancedAIPredictionOutput> => {
    if (!input.history || input.history.length === 0) {
      // Provide a default prediction and explanation if no history is available
      return {
        bigSmall: 'SMALL',
        oddEven: 'ODD',
        leopardChance: 'Rendah',
        confidence: 0,
        explanation: 'Tidak ada riwayat permainan yang cukup untuk membuat prediksi. Silakan masukkan beberapa hasil putaran dadu.',
      };
    }

    const historyJson = JSON.stringify(input.history, null, 2); // Pretty print for better context in prompt
    const historyLength = input.history.length;

    const {output} = await enhancedAIPredictionPrompt({ historyJson: historyJson, historyLength: historyLength });
    return output!;
  }
);

export async function enhancedAIPredictionExplanation(input: EnhancedAIPredictionInput): Promise<EnhancedAIPredictionOutput> {
  return enhancedAIPredictionExplanationFlow(input);
}
