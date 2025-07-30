
"use client";

import Link from "next/link";
import { disasters } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { cn } from "@/lib/utils";
import { useEffect, useState, useTransition } from "react";
import { getRecentActivity } from "@/ai/flows/recent-activity-flow";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiveNewsCard } from "@/components/dashboard/live-news-card";
import { Button } from "@/components/ui/button";

const statusColors: { [key: string]: string } = {
  Safe: "bg-green-500 hover:bg-green-600",
  Warning: "bg-yellow-500 hover:bg-yellow-600",
  Alert: "bg-red-500 hover:bg-red-600",
};

export default function DashboardPage() {
    const [activities, setActivities] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchActivity = async () => {
            setLoading(true);
            try {
                const recentActivities = await getRecentActivity();
                setActivities(recentActivities);
            } catch (error) {
                console.error("Failed to fetch recent activity:", error);
                // This toast may not be necessary anymore since the flow provides fallback data.
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not fetch recent activity.",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, [toast]);


  return (
    <>
      <PageHeader
        title="FLECT Dashboard"
        description="Monitoring global disaster events in real-time."
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="news">Live News</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {disasters.map((disaster) => (
                <Link href={`/dashboard/disaster/${disaster.id}`} key={disaster.id}>
                    <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <CardTitle className="font-headline text-2xl">
                            {disaster.name}
                            </CardTitle>
                            <CardDescription>{disaster.description}</CardDescription>
                        </div>
                        <disaster.icon className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-end">
                        <Badge
                        className={cn("text-white text-sm", statusColors[disaster.status])}
                        >
                        {disaster.status}
                        </Badge>
                    </CardContent>
                    </Card>
                </Link>
                ))}
            </div>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <Button asChild variant="outline" className="h-20 text-base">
                                <Link href="/dashboard/reports">Report an Incident</Link>
                            </Button>
                             <Button asChild variant="outline" className="h-20 text-base">
                                <Link href="/dashboard/safety" >Check My Area</Link>
                            </Button>
                             <Button asChild variant="outline" className="h-20 text-base">
                                <Link href="/dashboard/alerts" >View Live Alerts</Link>
                            </Button>
                             <Button asChild variant="outline" className="h-20 text-base">
                                <Link href="/dashboard/education" >Safety Guides</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Recent Activity</CardTitle>
                            <CardDescription>Latest updates from the platform.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-5 w-4/5" />
                                    <Skeleton className="h-5 w-full" />
                                    <Skeleton className="h-5 w-3/4" />
                                </div>
                            ) : (
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    {activities.map((activity, index) => (
                                        <li key={index} dangerouslySetInnerHTML={{ __html: activity }} />
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
        </TabsContent>
        <TabsContent value="news" className="mt-4">
            <LiveNewsCard />
        </TabsContent>
      </Tabs>
    </>
  );
}
