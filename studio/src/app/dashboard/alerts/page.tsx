"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Alert as AlertType, AlertSeverity } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Siren, ShieldAlert, Bell } from "lucide-react";
import { getLiveAlerts } from "@/ai/flows/live-alerts-flow";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";


const severityConfig: Record<
  AlertSeverity,
  {
    borderColor: string;
    textColor: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeVariant: "destructive" | "secondary" | "default";
  }
> = {
  High: {
    borderColor: "border-destructive",
    textColor: "text-destructive",
    icon: Siren,
    badgeVariant: "destructive",
  },
  Medium: {
    borderColor: "border-yellow-500",
    textColor: "text-yellow-500",
    icon: ShieldAlert,
    badgeVariant: "secondary",
  },
  Low: {
    borderColor: "border-primary",
    textColor: "text-primary",
    icon: Bell,
    badgeVariant: "default",
  },
};

const AlertSkeleton = () => (
    <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-1/6" />
            </div>
             <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-2" />
        </CardContent>
    </Card>
);

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<AlertType[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchAlerts = async () => {
            // setLoading(true); // This is already true initially
            try {
                const liveAlerts = await getLiveAlerts();
                setAlerts(liveAlerts);
            } catch (error) {
                console.error("Failed to fetch live alerts:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not fetch live alerts. The service may be temporarily unavailable.",
                });
                 setAlerts([]); // Clear alerts on error
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, [toast]);


  return (
    <>
      <PageHeader
        title="Live Alerts"
        description="Real-time feed of all active disaster alerts."
      />
      <div className="space-y-4">
        {loading ? (
           Array.from({ length: 4 }).map((_, i) => <AlertSkeleton key={i} />)
        ) : alerts.length > 0 ? (
          alerts.map((alert) => {
          const config = severityConfig[alert.severity];
          return (
            <Card
              key={alert.id}
              className={cn("border-l-4", config.borderColor)}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                        <config.icon className={cn("h-5 w-5", config.textColor)} />
                        {alert.disasterType} Alert
                    </CardTitle>
                    <Badge variant={config.badgeVariant}>{alert.severity}</Badge>
                </div>
                <CardDescription>
                    {alert.location} &bull;{" "}
                    {formatDistanceToNow(new Date(alert.timestamp), {
                    addSuffix: true,
                    })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{alert.message}</p>
              </CardContent>
            </Card>
          );
        })
        ) : (
            <Card>
                <CardHeader>
                    <CardTitle>No Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>There are no active alerts at this time or the alerting service is unavailable.</p>
                </CardContent>
            </Card>
        )
      }
      </div>
    </>
  );
}
