"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getSeismicData } from "@/ai/flows/seismic-data-flow";
import type { SeismicDataOutput } from "@/ai/flows/seismic-data-flow";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const formSchema = z.object({
  location: z.string().min(2, "Location is required."),
});

type SeismographChartData = {
    time: number;
    amplitude: number;
}

export function AdvancedEarthquakeCard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeismicDataOutput | null>(null);
  const [chartData, setChartData] = useState<SeismographChartData[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "San Francisco, CA",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    setChartData([]);
    try {
      const seismicData = await getSeismicData(values);
      setResult(seismicData);
      try {
        const parsedChartData = JSON.parse(seismicData.chartData);
        setChartData(parsedChartData);
      } catch (e) {
        console.error("Failed to parse chart data", e);
        toast({
            variant: "destructive",
            title: "AI Error",
            description: "The AI returned invalid seismograph data.",
        });
      }
    } catch (error) {
      console.error("Seismic data fetch failed:", error);
      toast({
        variant: "destructive",
        title: "Fetch Failed",
        description: "An error occurred while fetching seismic data.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Advanced Seismic Analysis</CardTitle>
        <CardDescription>
          Generate and view simulated real-time seismographic data for a location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Tokyo, Japan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching Seismic Data...
                </>
              ) : (
                "Get Live Seismograph"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      {result && (
        <CardFooter className="flex-col items-start gap-4">
          <Alert>
            <AlertTitle className="font-headline">Seismic Event Details</AlertTitle>
            <AlertDescription>
                Epicenter at <strong>{result.epicenter}</strong> with magnitude <strong>{result.magnitude}</strong>. 
                P-Wave velocity: {result.pWave} km/s, S-Wave velocity: {result.sWave} km/s.
            </AlertDescription>
          </Alert>
          
          {chartData.length > 0 && (
            <div className="w-full h-80 mt-4">
              <h3 className="font-headline text-lg mb-2">Live Seismograph Reading</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Amplitude', angle: -90, position: 'insideLeft' }} domain={[-1, 1]}/>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amplitude"
                    stroke="hsl(var(--primary))"
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
