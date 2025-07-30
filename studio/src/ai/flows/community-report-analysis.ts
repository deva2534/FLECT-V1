'use server';

/**
 * @fileOverview A community report analysis AI agent.
 *
 * - analyzeCommunityReport - A function that handles the analysis of community reports.
 * - CommunityReportInput - The input type for the analyzeCommunityReport function.
 * - CommunityReportOutput - The return type for the analyzeCommunityReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CommunityReportInputSchema = z.object({
  description: z.string().describe('The description of the report.'),
  photoDataUri: z
    .string()
    .describe(
      "A photo related to the report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  location: z
    .string()
    .describe(
      'The geo-location of the report (latitude and longitude)'
    ),
  disasterType: z.string().describe('The disaster type being reported.'),
});
export type CommunityReportInput = z.infer<typeof CommunityReportInputSchema>;

const CommunityReportOutputSchema = z.object({
  summary: z.string().describe('A summary of the community report.'),
  severity: z
    .string()
    .describe(
      'The severity level of the reported incident (e.g., low, medium, high).' // More descriptive.
    ),
  confidence: z
    .number()
    .describe(
      'A confidence score (0-1) indicating the reliability of the analysis.'
    ),
  emergingSituation: z
    .boolean()
    .describe(
      'Whether the report indicates an emerging situation that requires immediate attention.'
    ),
});
export type CommunityReportOutput = z.infer<typeof CommunityReportOutputSchema>;

export async function analyzeCommunityReport(
  input: CommunityReportInput
): Promise<CommunityReportOutput> {
  return analyzeCommunityReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'communityReportAnalysisPrompt',
  input: {schema: CommunityReportInputSchema},
  output: {schema: CommunityReportOutputSchema},
  prompt: `You are an AI assistant that analyzes community reports related to disasters.

You will receive a community report containing a description, a photo, the location, and the disaster type.
Your task is to analyze the report and provide a summary, a severity level, a confidence score, and an indication of whether it represents an emerging situation.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}
Location: {{{location}}}
Disaster Type: {{{disasterType}}}

Consider all available data to produce the output.

Output should conform to the specified JSON schema and should be complete.
`,
});

const analyzeCommunityReportFlow = ai.defineFlow(
  {
    name: 'analyzeCommunityReportFlow',
    inputSchema: CommunityReportInputSchema,
    outputSchema: CommunityReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
