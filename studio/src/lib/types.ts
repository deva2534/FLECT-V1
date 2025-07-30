import type { ElementType } from "react";

export type DisasterType = "Flood" | "Landslide" | "Earthquake" | "Cyclone" | "Tsunami";

export type DisasterStatus = "Safe" | "Warning" | "Alert";

export type Disaster = {
  id: string;
  name: DisasterType;
  status: DisasterStatus;
  description: string;
  icon: ElementType;
};

export type AlertSeverity = "Low" | "Medium" | "High";

export type Alert = {
    id: string;
    disasterType: DisasterType;
    severity: AlertSeverity;
    message: string;
    timestamp: string;
    location: string;
}

export type Education = {
    title: string;
    description: string;
    basics: string;
    image: string;
    dataAiHint: string;
};

export type SafetyAction = {
    step: number;
    action: string;
};

export type Hospital = {
    id: string;
    name: string;
    distance: string;
    phone?: string;
};

export type Article = {
    title: string;
    description: string;
    content: string;
    url: string;
    image: string;
    dataAiHint: string;
    publishedAt: string;
    source: {
        name: string;
        url: string;
    };
}
