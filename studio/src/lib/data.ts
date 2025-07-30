import { Disaster, Alert, Education, SafetyAction, DisasterType, Hospital } from "./types";
import { Waves, Mountain, Activity, Wind } from "lucide-react";

export const disasters: Disaster[] = [
  {
    id: "flood",
    name: "Flood",
    status: "Warning",
    description: "Rising water levels in several regions.",
    icon: Waves,
  },
  {
    id: "landslide",
    name: "Landslide",
    status: "Safe",
    description: "No immediate landslide threats detected.",
    icon: Mountain,
  },
  {
    id: "earthquake",
    name: "Earthquake",
    status: "Alert",
    description: "Major seismic activity detected. Take cover now.",
    icon: Activity,
  },
  {
    id: "cyclone",
    name: "Cyclone",
    status: "Warning",
    description: "Cyclone approaching coastal areas.",
    icon: Wind,
  },
  {
    id: "tsunami",
    name: "Tsunami",
    status: "Safe",
    description: "No tsunami warnings at this time.",
    icon: Waves,
  },
];

export const alerts: Alert[] = [
  {
    id: '1',
    disasterType: 'Earthquake',
    severity: 'High',
    message: 'Magnitude 7.2 earthquake reported near North City. Aftershocks possible. Drop, Cover, and Hold On.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    location: 'North City',
  },
  {
    id: '2',
    disasterType: 'Flood',
    severity: 'Medium',
    message: 'Riverfront area experiencing minor flooding due to heavy rainfall. Avoid low-lying areas.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    location: 'Riverfront District',
  },
  {
    id: '3',
    disasterType: 'Cyclone',
    severity: 'High',
    message: 'Cyclone "Aria" expected to make landfall in 12 hours. Evacuation orders in effect for coastal zones.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    location: 'Eastern Coastline',
  },
  {
    id: '4',
    disasterType: 'Flood',
    severity: 'Low',
    message: 'Flash flood watch issued for Central County until 6 PM. Be aware of potential road closures.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    location: 'Central County',
  },
];

export const educationContent: Record<DisasterType, Education> = {
  Flood: {
    title: "Understanding Floods",
    description: "Floods are the most frequent type of natural disaster and occur when an overflow of water submerges land that is usually dry.",
    basics: "Learn about flash floods, river floods, and coastal floods. Understand the risks associated with each.",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "flooding water",
  },
  Landslide: {
    title: "Understanding Landslides",
    description: "A landslide is defined as the movement of rock, debris, or earth down a sloped section of land.",
    basics: "Landslides are caused by rain, earthquakes, volcanoes, or other factors that make the slope unstable.",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "landslide mud",
  },
  Earthquake: {
    title: "Understanding Earthquakes",
    description: "An earthquake is the shaking of the surface of the Earth resulting from a sudden release of energy in the Earth's lithosphere that creates seismic waves.",
    basics: "Learn about fault lines, seismic waves, and how earthquake magnitudes are measured.",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "cracked ground",
  },
  Cyclone: {
    title: "Understanding Cyclones",
    description: "A cyclone is a large-scale air mass that rotates around a strong center of low atmospheric pressure.",
    basics: "Understand cyclone categories, storm surges, and the difference between cyclones, hurricanes, and typhoons.",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "cyclone satellite",
  },
  Tsunami: {
    title: "Understanding Tsunamis",
    description: "A tsunami is a series of waves in a water body caused by the displacement of a large volume of water, generally in an ocean or a large lake.",
    basics: "Tsunamis are often caused by underwater earthquakes. Learn to recognize the natural warning signs.",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "tsunami wave",
  },
};

export const safetyActions: Record<DisasterType, SafetyAction[]> = {
    Flood: [
      { step: 1, action: "Move to higher ground immediately." },
      { step: 2, action: "Avoid walking or driving through floodwaters." },
      { step: 3, action: "Listen to emergency broadcasts for updates." },
    ],
    Landslide: [
      { step: 1, action: "Move away from the path of a landslide or debris flow." },
      { step: 2, action: "Listen for unusual sounds that might indicate moving debris." },
      { step: 3, action: "If you are near a stream or channel, be alert for any sudden increase or decrease in water flow." },
    ],
    Earthquake: [
      { step: 1, action: "Drop to the ground." },
      { step: 2, action: "Take Cover under a sturdy table or desk." },
      { step: 3, action: "Hold On until the shaking stops." },
    ],
    Cyclone: [
      { step: 1, action: "Stay indoors and away from windows." },
      { step: 2, action: "Secure loose objects outside your home." },
      { step: 3, action: "Have an emergency kit ready with food, water, and first aid." },
    ],
    Tsunami: [
      { step: 1, action: "If you are in a coastal area and feel an earthquake, move to higher ground." },
      { step: 2, action: "Listen to official warnings." },
      { step: 3, action: "Do not return to the coast until authorities say it is safe." },
    ],
  };
