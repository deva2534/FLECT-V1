'use server';

/**
 * @fileOverview An AI agent for generating recent platform activity.
 *
 * - getRecentActivity - A function that returns a list of recent activities.
 * - RecentActivityOutput - The return type for the getRecentActivity function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const RecentActivityOutputSchema = z.array(
    z.string().describe("A short string describing a recent activity, formatted with HTML for bolding key parts.")
);
export type RecentActivityOutput = z.infer<typeof RecentActivityOutputSchema>;


export async function getRecentActivity(): Promise<RecentActivityOutput> {
  return recentActivityFlow();
}

const prompt = ai.definePrompt({
  name: 'recentActivityPrompt',
  output: { schema: RecentActivityOutputSchema },
  prompt: `You are an AI assistant that generates a list of 3 realistic, recent activities for a disaster management platform's dashboard.

  The activities should look like a log or feed. Examples could include new alerts, community reports, or system updates.
  Format key parts of the activity string with HTML '<strong>' tags for emphasis. For example: '<strong>New Alert:</strong> Minor flooding in Riverfront District.'
  Ensure the output is a valid JSON array of strings.`,
});

const recentActivityFlow = ai.defineFlow(
  {
    name: 'recentActivityFlow',
    outputSchema: RecentActivityOutputSchema,
  },
  async () => {
    try {
        const { output } = await prompt();
        return output!;
    } catch (error) {
        console.warn("AI for recent activity failed, returning mock data.", error);
        return [
            "<strong>New Alert:</strong> High wind warning issued for Coastal Region.",
            "<strong>Community Report:</strong> Power outage reported in Downtown.",
            "<strong>System Update:</strong> New seismic sensors deployed in Zone 4."
        ];
    }
  }
);
