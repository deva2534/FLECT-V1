// IMPORTANT: THIS IS A MOCK SERVICE FOR DEMONSTRATION
// In a real application, you would use a proper news API service
// and securely handle your API key on the server-side.

import { Article } from "@/lib/types";

// For the purpose of this hackathon, we will return mock data.
// The GNews API has a free tier but can be unreliable.
// Using mock data ensures the app is stable for judging.
const mockNewsData: Article[] = [
    {
        title: "Heavy Rains Trigger Flash Floods in Northern Regions, Thousands Evacuated",
        description: "Authorities have issued a red alert as incessant rainfall leads to severe flooding, displacing over 5,000 people and disrupting transport networks.",
        content: "Continuous heavy rainfall over the past 48 hours has resulted in severe flash floods across several northern districts. The National Disaster Response Force (NDRF) has been deployed for rescue operations. Evacuation centers have been set up in local schools and community halls. The meteorological department predicts more rain in the coming 24 hours and has advised citizens to move to safer, higher ground. All major highways in the region are currently closed, and train services have been suspended.",
        url: "https://example.com/flood-news-1",
        image: "https://placehold.co/600x400.png",
        dataAiHint: "floodwater street",
        publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
        source: {
            name: "Global News Network",
            url: "https://example.com/gns"
        }
    },
    {
        title: "Magnitude 6.8 Earthquake Strikes a Remote Area; Damage Assessment Underway",
        description: "A strong earthquake rattled a remote mountainous region early this morning. Communication lines are down, and initial reports of landslides are coming in.",
        content: "A powerful earthquake with a preliminary magnitude of 6.8 struck the remote Hindukush mountain range today at 5:30 AM local time. The epicenter was located 50km from the nearest town. While there are no immediate reports of casualties, officials are concerned about potential landslides blocking access to remote villages. Communication with the affected area is currently severed. Emergency teams are being airlifted to conduct an initial damage assessment and provide aid.",
        url: "https://example.com/quake-news-1",
        image: "https://placehold.co/600x400.png",
        dataAiHint: "earthquake rubble",
        publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
        source: {
            name: "Seismic Watch",
            url: "https://example.com/seismic-watch"
        }
    },
     {
        title: "Cyclone 'Leo' Intensifies, Expected to Make Landfall on West Coast Tomorrow",
        description: "Cyclone 'Leo' has rapidly intensified into a 'very severe cyclonic storm' and is projected to hit the western coastline tomorrow evening with wind speeds of up to 150 km/h.",
        content: "The weather bureau has upgraded Cyclone 'Leo' to a very severe category. It is currently located 300km off the coast and is moving north-west. It is expected to make landfall between two major coastal cities tomorrow evening. Fishermen have been warned not to venture into the sea, and a massive evacuation process has been initiated in all low-lying coastal areas. Teams are on standby for post-cyclone relief and restoration work.",
        url: "https://example.com/cyclone-news-1",
        image: "https://placehold.co/600x400.png",
        dataAiHint: "cyclone satellite",
        publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(), // 8 hours ago
        source: {
            name: "Weather Today",
            url: "https://example.com/weather-today"
        }
    }
];


export async function getDisasterNews(): Promise<Article[]> {
  console.log("Fetching mock disaster news...");
  // In a real implementation, you would use the GNews API like this:
  // const apiKey = process.env.GNEWS_API_KEY;
  // const query = 'disaster OR flood OR earthquake OR cyclone OR landslide OR tsunami';
  // const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=us&max=5&apikey=${apiKey}`;
  // const response = await fetch(url);
  // if (!response.ok) {
  //   throw new Error(`GNews API request failed with status ${response.status}`);
  // }
  // const data = await response.json();
  // return data.articles;
  return new Promise(resolve => setTimeout(() => resolve(mockNewsData), 500));
}
