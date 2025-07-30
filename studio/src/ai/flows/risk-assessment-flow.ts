'use server';

/**
 * @fileOverview An AI agent for assessing disaster risk.
 *
 * - getRiskAssessment - A function that returns risk scores for various disasters.
 * - RiskAssessmentInput - The input type for the getRiskAssessment function.
 * - RiskAssessmentOutput - The return type for the getRiskAssessment function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const RiskAssessmentInputSchema = z.object({
  location: z.string().describe('The location for which to assess disaster risk.'),
  reportType: z.enum(['today', 'historical']).describe("The type of risk report to generate (today's or historical)."),
});
export type RiskAssessmentInput = z.infer<typeof RiskAssessmentInputSchema>;

const RiskAssessmentOutputSchema = z.object({
  Flood: z.number().min(0).max(100).describe('The risk score for Flood (0-100).'),
  Landslide: z.number().min(0).max(100).describe('The risk score for Landslide (0-100).'),
  Earthquake: z.number().min(0).max(100).describe('The risk score for Earthquake (0-100).'),
  Cyclone: z.number().min(0).max(100).describe('The risk score for Cyclone (0-100).'),
  Tsunami: z.number().min(0).max(100).describe('The risk score for Tsunami (0-100).'),
});
export type RiskAssessmentOutput = z.infer<typeof RiskAssessmentOutputSchema>;

export async function getRiskAssessment(
  input: RiskAssessmentInput
): Promise<RiskAssessmentOutput> {
  return riskAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'riskAssessmentPrompt',
  input: { schema: RiskAssessmentInputSchema },
  output: { schema: RiskAssessmentOutputSchema },
  prompt: `You are a disaster risk assessment specialist. Based on the provided location and report type, generate a risk score (from 0 to 100) for each of the following disaster types: Flood, Landslide, Earthquake, Cyclone, and Tsunami.

Location: {{{location}}}
Report Type: {{{reportType}}}

Consider geographical factors. For example, a coastal city like 'Chennai' would have a higher Tsunami and Cyclone risk. A place in a seismically active zone like 'San Francisco' would have a higher earthquake risk. Use general knowledge to produce a plausible set of scores.
For 'historical' reports, the scores should generally be lower than for 'today's' risk.
Return only the JSON object with the scores.`,
});

const riskAssessmentFlow = ai.defineFlow(
  {
    name: 'riskAssessmentFlow',
    inputSchema: RiskAssessmentInputSchema,
    outputSchema: RiskAssessmentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
