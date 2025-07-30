import { config } from 'dotenv';
config();

import '@/ai/flows/disaster-prediction-flow.ts';
import '@/ai/flows/community-report-analysis.ts';
import '@/ai/flows/seismic-data-flow.ts';
import '@/ai/flows/nearby-hospitals-flow.ts';
import '@/ai/flows/risk-assessment-flow.ts';
import '@/ai/flows/live-alerts-flow.ts';
import '@/ai/flows/recent-activity-flow.ts';
import '@/ai/flows/summarize-and-speak.ts';
