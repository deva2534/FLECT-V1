// This is a server-side file.
'use server';
/**
 * @fileOverview Implements the AI-powered disaster prediction graph generation.
 *
 * - disasterPrediction - A function that handles disaster prediction and returns a description and chart data.
 * - DisasterPredictionInput - The input type for the disasterPrediction function.
 * - DisasterPredictionOutput - The return type for the disasterPrediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisasterPredictionInputSchema = z.object({
  disasterType: z.enum(['Flood', 'Landslide', 'Earthquake', 'Cyclone', 'Tsunami']).describe('The type of disaster for which to generate a prediction.'),
  location: z.string().describe('The location for which to generate a disaster prediction.'),
  relevantData: z.string().describe('Relevant data for the specified disaster type at the location (e.g., rainfall data for flood prediction).'),
});
export type DisasterPredictionInput = z.infer<typeof DisasterPredictionInputSchema>;

const DisasterPredictionOutputSchema = z.object({
  description: z.string().describe('A textual description of the disaster prediction, including potential impacts and uncertainties.'),
  chartData: z.string().describe('A JSON string representing the chart data for visualizing the disaster prediction.  The data should be suitable for rendering a chart using a charting library.'),
});
export type DisasterPredictionOutput = z.infer<typeof DisasterPredictionOutputSchema>;

export async function disasterPrediction(input: DisasterPredictionInput): Promise<DisasterPredictionOutput> {
  return disasterPredictionFlow(input);
}

const disasterPredictionPrompt = ai.definePrompt({
  name: 'disasterPredictionPrompt',
  input: {schema: DisasterPredictionInputSchema},
  output: {schema: DisasterPredictionOutputSchema},
  prompt: `You are an AI assistant that generates disaster predictions and suitable data for charts.

  Based on the disaster type, location, and relevant data provided, generate a concise description of the potential disaster impact.
  In addition to the description, generate chart data suitable for visualizing the prediction. The chart data should be returned as a JSON string.

  Disaster Type: {{{disasterType}}}
  Location: {{{location}}}
  Relevant Data: {{{relevantData}}}

  Ensure that the description includes key insights and uncertainties related to the prediction.
  The chart data must be a valid JSON string.
  `, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  }
});

const disasterPredictionFlow = ai.defineFlow(
  {
    name: 'disasterPredictionFlow',
    inputSchema: DisasterPredictionInputSchema,
    outputSchema: DisasterPredictionOutputSchema,
  },
  async input => {
    const {output} = await disasterPredictionPrompt(input);
    return output!;
  }
);
