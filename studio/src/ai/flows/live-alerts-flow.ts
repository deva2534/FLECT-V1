'use server';

/**
 * @fileOverview An AI agent for generating live disaster alerts.
 *
 * - getLiveAlerts - A function that returns a list of recent disaster alerts.
 * - LiveAlertsOutput - The return type for the getLiveAlerts function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { AlertSeverity, DisasterType } from '@/lib/types';

const LiveAlertsOutputSchema = z.array(z.object({
    id: z.string().describe("A unique ID for the alert."),
    disasterType: z.enum(["Flood", "Landslide", "Earthquake", "Cyclone", "Tsunami"]).describe("The type of disaster."),
    severity: z.enum(["Low", "Medium", "High"]).describe("The severity of the alert."),
    message: z.string().describe("The alert message."),
    timestamp: z.string().datetime().describe("The ISO 8601 timestamp of when the alert was issued."),
    location: z.string().describe("The location of the alert."),
}));
export type LiveAlertsOutput = z.infer<typeof LiveAlertsOutputSchema>;


export async function getLiveAlerts(): Promise<LiveAlertsOutput> {
  return liveAlertsFlow();
}

const prompt = ai.definePrompt({
  name: 'liveAlertsPrompt',
  output: { schema: LiveAlertsOutputSchema },
  prompt: `You are an AI assistant that generates a list of 4 realistic, recent-looking disaster alerts for a monitoring dashboard.

  Generate a diverse set of alerts with varying disaster types, severities, and locations.
  The timestamps should be recent, within the last 24 hours.
  Make the messages concise but informative.
  Ensure the output is a valid JSON array matching the provided schema.`,
});

const liveAlertsFlow = ai.defineFlow(
  {
    name: 'liveAlertsFlow',
    outputSchema: LiveAlertsOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
