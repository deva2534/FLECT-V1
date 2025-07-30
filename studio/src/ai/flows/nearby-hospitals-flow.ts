'use server';

/**
 * @fileOverview A backend service for finding nearby hospitals using the Overpass API.
 *
 * - getNearbyHospitals - A function that returns a list of nearby hospitals based on location.
 * - NearbyHospitalsInput - The input type for the getNearbyHospitals function.
 * - NearbyHospitalsOutput - The return type for the getNearbyHospitals function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Hospital } from '@/lib/types';

const NearbyHospitalsInputSchema = z.object({
  location: z.string().describe('The location (latitude, longitude) for which to find nearby hospitals.'),
});
export type NearbyHospitalsInput = z.infer<typeof NearbyHospitalsInputSchema>;

const NearbyHospitalsOutputSchema = z.array(z.object({
    id: z.string(),
    name: z.string(),
    distance: z.string(),
    phone: z.string().optional(),
}));
export type NearbyHospitalsOutput = z.infer<typeof NearbyHospitalsOutputSchema>;

// Haversine formula to calculate distance between two lat/lon points
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}


export async function getNearbyHospitals(
  input: NearbyHospitalsInput
): Promise<NearbyHospitalsOutput> {
  return nearbyHospitalsFlow(input);
}

const nearbyHospitalsFlow = ai.defineFlow(
  {
    name: 'nearbyHospitalsFlow',
    inputSchema: NearbyHospitalsInputSchema,
    outputSchema: NearbyHospitalsOutputSchema,
  },
  async (input) => {
    const [lat, lon] = input.location.split(',').map(s => parseFloat(s.trim()));
    const radius = 5000; // 5km radius

    const query = `
      [out:json];
      node["amenity"="hospital"](around:${radius},${lat},${lon});
      out;
    `;
    
    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Overpass API request failed with status:", response.status);
            return [];
        }
        const data = await response.json();

        const hospitals = data.elements.map((h: any) => {
            const distanceInKm = getDistance(lat, lon, h.lat, h.lon);
            return {
                id: h.id.toString(),
                name: h.tags.name || "Unnamed Hospital",
                distance: `${distanceInKm.toFixed(1)} km`,
                phone: h.tags.phone || "N/A",
            };
        }).slice(0, 3); // Return top 3 results

        return hospitals;
    } catch (error) {
        console.error("Error fetching or processing hospital data:", error);
        return [];
    }
  }
);
