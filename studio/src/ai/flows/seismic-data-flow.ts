'use server';

/**
 * @fileOverview An AI agent for generating seismic data.
 *
 * - getSeismicData - A function that handles the generation of seismic data.
 * - SeismicDataInput - The input type for the getSeismicData function.
 * - SeismicDataOutput - The return type for the getSeismicData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SeismicDataInputSchema = z.object({
  location: z.string().describe('The location for which to generate seismic data.'),
});
export type SeismicDataInput = z.infer<typeof SeismicDataInputSchema>;

const SeismicDataOutputSchema = z.object({
  pWave: z.number().describe('The P-wave velocity in km/s.'),
  sWave: z.number().describe('The S-wave velocity in km/s.'),
  magnitude: z.number().describe('The earthquake magnitude on the Richter scale.'),
  epicenter: z.string().describe('The epicenter of the seismic activity.'),
  chartData: z.string().describe('A JSON string representing the seismograph reading. The data should be suitable for rendering a line chart.'),
});
export type SeismicDataOutput = z.infer<typeof SeismicDataOutputSchema>;

export async function getSeismicData(
  input: SeismicDataInput
): Promise<SeismicDataOutput> {
  return getSeismicDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'seismicDataPrompt',
  input: { schema: SeismicDataInputSchema },
  output: { schema: SeismicDataOutputSchema },
  prompt: `You are an expert seismologist. Based on the location provided, generate realistic seismic data for a recent or probable earthquake event.

Location: {{{location}}}

Generate a P-wave velocity, S-wave velocity, magnitude, epicenter, and a JSON string for a line chart representing a seismograph reading.
The chart data should have 'time' (in seconds) and 'amplitude' (from -1 to 1) keys.
`,
});

const getSeismicDataFlow = ai.defineFlow(
  {
    name: 'getSeismicDataFlow',
    inputSchema: SeismicDataInputSchema,
    outputSchema: SeismicDataOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
