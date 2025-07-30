
"use client";

import { notFound, useParams } from "next/navigation";
import { disasters } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiPredictionCard } from "@/components/disaster/ai-prediction-card";
import { CommunityReportCard } from "@/components/disaster/community-report-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdvancedEarthquakeCard } from "@/components/disaster/advanced-earthquake-card";
import { DisasterType } from "@/lib/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const disasterInfo: Record<
  DisasterType,
  {
    mapTitle: string;
    mapUrl: string;
    mapPreviewImage: string;
    mapDataAiHint: string;
    videoUrl: string;
  }
> = {
  Flood: {
    mapTitle: "Live Rainfall Intensity Map",
    mapUrl: "https://zoom.earth/maps/precipitation/#view=15.02,84.91,5.94z/model=icon",
    mapPreviewImage: "https://placehold.co/600x400.png",
    mapDataAiHint: "rainfall map",
    videoUrl: "https://www.youtube.com/embed/43M5mZuzHF8?si=6n42ryLgzaZfP9bg&start=8"
  },
  Landslide: {
    mapTitle: "Live Soil Saturation Map",
    mapUrl: "https://zoom.earth/maps/soil-moisture/#view=20,80,5z/model=icon",
    mapPreviewImage: "https://placehold.co/600x400.png",
    mapDataAiHint: "soil moisture",
    videoUrl: "https://www.youtube.com/embed/ej39BElKhKo?si=ge9I-fIFj_nSI7Uv&start=8"
  },
  Earthquake: {
    mapTitle: "Live Seismic Monitor",
    mapUrl: "https://www.iris.edu/app/seismic-monitor/map?lat=30.2123&lng=68.6373&zoom=2",
    mapPreviewImage: "https://placehold.co/600x400.png",
    mapDataAiHint: "seismic map",
    videoUrl: "https://www.youtube.com/embed/r5EbbrVXoQw?si=w5Hx801WFMyxoX-K&start=8"
  },
  Cyclone: {
    mapTitle: "Live Wind & Storm Tracker",
    mapUrl: "https://zoom.earth/",
    mapPreviewImage: "https://placehold.co/600x400.png",
    mapDataAiHint: "cyclone path",
    videoUrl: "https://www.youtube.com/embed/TqZ3M7xh8jM?si=Z-u46izC_cee3f6C&start=8"
  },
  Tsunami: {
    mapTitle: "Live Wave Propagation Map",
    mapUrl: "https://zoom.earth/places/india/chennai/#map=wind-speed/model=icon",
    mapPreviewImage: "https://placehold.co/600x400.png",
    mapDataAiHint: "wave map",
    videoUrl: "https://www.youtube.com/embed/7EDflnGzjTY?si=NZmdCrjBdz8G-V6C&start=8"
  },
};

const TabContentSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-8 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </CardContent>
    </Card>
)

export default function DisasterTypePage() {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("prediction");
  const params = useParams();
  const type = params.type as string;

  const disaster = disasters.find((d) => d.id === type);
  
  // Simulate loading when the component mounts
  useEffect(() => {
    startTransition(() => {
      // This is where you might fetch data in a real app
    });
  }, []);

  if (!disaster) {
    notFound();
  }

  const disasterData = disasterInfo[disaster.name];

  const handleTabChange = (value: string) => {
    startTransition(() => {
        setActiveTab(value);
    });
  }

  return (
    <>
      <Button asChild variant="outline" className="mb-4">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <PageHeader
        title={`${disaster.name} Dashboard`}
        description={`Live data, predictions, and reporting for ${disaster.name.toLowerCase()} events.`}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
            {isPending ? (
                 <TabContentSkeleton />
            ) : (
                <Tabs defaultValue="prediction" className="w-full" onValueChange={handleTabChange} value={activeTab}>
                    <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="prediction">AI Prediction</TabsTrigger>
                    <TabsTrigger value="reporting">Community Reporting</TabsTrigger>
                    </TabsList>
                    <TabsContent value="prediction" className="mt-4">
                        <AiPredictionCard disasterType={disaster.name} />
                    </TabsContent>
                    <TabsContent value="reporting" className="mt-4">
                        <CommunityReportCard disasterType={disaster.name} />
                    </TabsContent>
                </Tabs>
            )}
          {disaster.id === 'earthquake' && <AdvancedEarthquakeCard />}
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">How to Survive an {disaster.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                       <iframe 
                        className="w-full h-full rounded-md" 
                        src={disasterData.videoUrl} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen>
                       </iframe>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">{disasterData.mapTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden relative">
                        <Image
                            src={disasterData.mapPreviewImage}
                            alt={`${disasterData.mapTitle} Preview`}
                            data-ai-hint={disasterData.mapDataAiHint}
                            fill={true}
                            style={{objectFit: "cover"}}
                        />
                    </div>
                    <Button asChild className="w-full">
                        <Link href={disasterData.mapUrl} target="_blank">
                            <ExternalLink className="mr-2" />
                            View Live Map
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
