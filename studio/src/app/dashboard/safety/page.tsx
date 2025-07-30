
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, MapPin, LocateFixed, Hospital, Phone } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { DisasterType, Hospital as HospitalType } from "@/lib/types";
import { safetyActions } from "@/lib/data";
import { getNearbyHospitals } from "@/ai/flows/nearby-hospitals-flow";
import { getRiskAssessment } from "@/ai/flows/risk-assessment-flow";
import { useToast } from "@/hooks/use-toast";

const FormSchema = z.object({
  location: z.string().min(2, "Please enter a location."),
});

type RiskScores = Record<DisasterType, number>;
type ReportType = "today" | "historical";

export default function SafetyPage() {
  const [riskScores, setRiskScores] = useState<RiskScores | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState<ReportType | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [hospitalsLoading, setHospitalsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nearbyHospitals, setNearbyHospitals] = useState<HospitalType[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      location: "",
    },
  });
  
  const { setValue, handleSubmit, watch, trigger } = form;
  const location = watch("location");

  const handleGeoLocation = async (isAuto: boolean = false) => {
    if (navigator.geolocation) {
      setGeoLoading(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setValue("location", locationString, { shouldValidate: true });
          setGeoLoading(false);
          if (isAuto) {
            handleFormSubmit("today");
          }
        },
        (err) => {
          setError(`Error getting location: ${err.message}`);
          setGeoLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };
  
  useEffect(() => {
    handleGeoLocation(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location) {
      const fetchHospitals = async () => {
        setHospitalsLoading(true);
        try {
          const hospitals = await getNearbyHospitals({ location });
          setNearbyHospitals(hospitals);
        } catch (error) {
          console.error("Failed to fetch hospitals:", error);
        } finally {
            setHospitalsLoading(false);
        }
      };
      fetchHospitals();
    }
  }, [location]);

  async function handleFormSubmit(type: ReportType) {
    const isValid = await trigger("location");
    if (!isValid) return;

    setLoading(true);
    setRiskScores(null);
    setReportType(type);
    setError(null);

    try {
      const newRiskScores = await getRiskAssessment({
        location,
        reportType: type,
      });
      setRiskScores(newRiskScores);
    } catch (error) {
      console.error("Risk assessment failed:", error);
      toast({
        variant: "destructive",
        title: "Assessment Failed",
        description: "An error occurred while generating the risk assessment.",
      });
    } finally {
      setLoading(false);
    }
  }

  function getRiskColor(score: number) {
    if (score > 70) return "bg-destructive";
    if (score > 40) return "bg-yellow-500";
    return "bg-green-500";
  }

  return (
    <>
      <PageHeader
        title="My Area Safety"
        description="Check disaster risk scores for your location."
      />

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Check Your Location</CardTitle>
            <CardDescription>
              Enter your location to get the latest risk assessment. We'll attempt to fetch it automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (Lat, Long)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Fetching location..." {...field} className="pl-10 pr-10" />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                            onClick={() => handleGeoLocation(false)}
                            disabled={geoLoading}
                          >
                            {geoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        We use your location to determine local risks.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                        type="button"
                        onClick={() => handleFormSubmit("today")}
                        disabled={loading}
                    >
                        {loading && reportType === "today" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading && reportType === "today" ? "Calculating..." : "Today's Risk Score"}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleFormSubmit("historical")}
                        disabled={loading}
                    >
                        {loading && reportType === "historical" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading && reportType === "historical" ? "Calculating..." : "Historical Risk Score"}
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Nearby Medical Centers</CardTitle>
                <CardDescription>
                    Quick access to medical facilities in your vicinity.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {hospitalsLoading ? (
                    <div className="flex items-center gap-4">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <p className="text-muted-foreground text-sm">Fetching nearby hospitals...</p>
                    </div>
                ) : nearbyHospitals.length > 0 ? nearbyHospitals.map(hospital => (
                    <div key={hospital.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-4">
                            <Hospital className="h-6 w-6 text-primary" />
                            <div>
                                <p className="font-semibold">{hospital.name}</p>
                                <p className="text-sm text-muted-foreground">{hospital.distance} away</p>
                            </div>
                        </div>
                        {hospital.phone && hospital.phone !== "N/A" && (
                            <Button variant="ghost" size="icon" asChild>
                                <a href={`tel:${hospital.phone}`}>
                                    <Phone className="h-5 w-5" />
                                </a>
                            </Button>
                        )}
                    </div>
                )) : (
                  <p className="text-muted-foreground text-sm">No hospitals found within a 5km radius.</p>
                )}
            </CardContent>
        </Card>
      </div>

      {loading && !riskScores && (
        <div className="mt-8 grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">
                {reportType === 'today' ? "Calculating Today's Risk Assessment..." : "Calculating Historical Risk Assessment..."}
              </CardTitle>
              <CardDescription>
                  Please wait while our AI analyzes the risk for your location.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {(['Flood', 'Landslide', 'Earthquake', 'Cyclone', 'Tsunami'] as DisasterType[]).map((disaster) => (
                    <div key={disaster}>
                    <div className="flex justify-between mb-1">
                        <span className="font-medium">{disaster}</span>
                    </div>
                    <Progress value={Math.random() * 100} className="animate-pulse" />
                    </div>
                ))}
            </CardContent>
          </Card>
        </div>
      )}

      {riskScores && !loading && (
        <div className="mt-8 grid gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">
                      {reportType === 'today' ? "Today's Risk Assessment" : "Historical Risk Assessment"}
                    </CardTitle>
                    <CardDescription>
                        Based on your location and {reportType === 'today' ? "current conditions." : "historical data."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                {(Object.keys(riskScores) as DisasterType[]).map((disaster) => (
                    <div key={disaster}>
                    <div className="flex justify-between mb-1">
                        <span className="font-medium">{disaster}</span>
                        <span className="text-muted-foreground">{riskScores[disaster]}%</span>
                    </div>
                    <Progress value={riskScores[disaster]} className={getRiskColor(riskScores[disaster])} />
                    </div>
                ))}
                </CardContent>
            </Card>

            {(Object.keys(riskScores) as DisasterType[]).filter(d => riskScores[d] > 50).map((disaster) => (
                <Card key={disaster} className="border-l-4 border-yellow-500">
                    <CardHeader>
                        <CardTitle>What to do for {disaster}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 list-disc pl-5">
                            {safetyActions[disaster].map(action => (
                                <li key={action.step}>
                                    <span className="font-semibold">Step {action.step}:</span> {action.action}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
    </>
  );
}
