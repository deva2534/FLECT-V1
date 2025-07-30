'use server';

/**
 * @fileOverview An AI agent for summarizing text and converting it to speech.
 *
 * - summarizeAndSpeak - A function that takes text, summarizes it, and returns audio.
 * - SummarizeAndSpeakInput - The input type for the summarizeAndSpeak function.
 * - SummarizeAndSpeakOutput - The return type for the summarizeAndSpeak function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

const SummarizeAndSpeakInputSchema = z.object({
  text: z.string().describe("The text content to be summarized and converted to speech."),
  source: z.string().describe("The source of the text, e.g., a news article URL.")
});
export type SummarizeAndSpeakInput = z.infer<typeof SummarizeAndSpeakInputSchema>;

const SummarizeAndSpeakOutputSchema = z.object({
  summary: z.string().describe("The generated summary of the text."),
  audioDataUri: z.string().describe("A data URI of the generated audio file in WAV format."),
});
export type SummarizeAndSpeakOutput = z.infer<typeof SummarizeAndSpeakOutputSchema>;

export async function summarizeAndSpeak(
  input: SummarizeAndSpeakInput
): Promise<SummarizeAndSpeakOutput> {
  return summarizeAndSpeakFlow(input);
}

const summaryPrompt = ai.definePrompt({
    name: 'summaryPrompt',
    input: { schema: z.object({ text: z.string(), source: z.string() }) },
    output: { schema: z.object({ summary: z.string() })},
    prompt: `You are a news summarization expert for a disaster management platform.
    
    Your task is to create a concise, factual summary of the provided article text.
    The summary should be about 3-4 sentences long and focus on the key information relevant to a disaster response team.
    Do not add any preamble or conclusion. Just provide the summary.
    
    Source: {{{source}}}
    Article Text: {{{text}}}
    `,
});


async function toWav(
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });
  
      let bufs: any[] = [];
      writer.on('error', reject);
      writer.on('data', function (d) {
        bufs.push(d);
      });
      writer.on('end', function () {
        resolve(Buffer.concat(bufs).toString('base64'));
      });
  
      writer.write(pcmData);
      writer.end();
    });
}


const summarizeAndSpeakFlow = ai.defineFlow(
  {
    name: 'summarizeAndSpeakFlow',
    inputSchema: SummarizeAndSpeakInputSchema,
    outputSchema: SummarizeAndSpeakOutputSchema,
  },
  async (input) => {
    // Step 1: Summarize the text
    const { output: summaryOutput } = await summaryPrompt(input);
    if (!summaryOutput) {
        throw new Error("Failed to generate summary.");
    }
    const summary = summaryOutput.summary;

    // Step 2: Convert the summary to speech
    const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: summary,
      });

      if (!media) {
        throw new Error('Text-to-speech generation failed to return media.');
      }

    // Step 3: Convert raw PCM audio to WAV format
    const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
    );
    const wavBase64 = await toWav(audioBuffer);
    
    return {
        summary: summary,
        audioDataUri: 'data:audio/wav;base64,' + wavBase64
    };
  }
);
