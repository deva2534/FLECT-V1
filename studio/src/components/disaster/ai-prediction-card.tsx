"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { disasterPrediction } from "@/ai/flows/disaster-prediction-flow";
import { DisasterType } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  disasterType: z.enum(["Flood", "Landslide", "Earthquake", "Cyclone", "Tsunami"]),
  location: z.string().min(2, "Location is required."),
  relevantData: z.string().min(10, "Please provide some relevant data."),
});

type PredictionResult = {
  description: string;
  chartData: any[];
};

export function AiPredictionCard({ disasterType }: { disasterType: DisasterType }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      disasterType: disasterType,
      location: "",
      relevantData: "",
    },
  });

  useEffect(() => {
    form.setValue("disasterType", disasterType);
  }, [disasterType, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const prediction = await disasterPrediction(values);
      let chartData = [];
      try {
        chartData = JSON.parse(prediction.chartData);
      } catch (e) {
        console.error("Failed to parse chart data", e);
        toast({
            variant: "destructive",
            title: "AI Error",
            description: "The AI returned invalid chart data. Please try again.",
        });
      }
      setResult({ description: prediction.description, chartData });
    } catch (error) {
      console.error("Prediction failed:", error);
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: "An error occurred while generating the prediction.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">AI-Powered Prediction</CardTitle>
        <CardDescription>
          Use our AI to forecast potential disaster impacts based on real-time data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="disasterType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disaster Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a disaster type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Flood">Flood</SelectItem>
                      <SelectItem value="Landslide">Landslide</SelectItem>
                      <SelectItem value="Earthquake">Earthquake</SelectItem>
                      <SelectItem value="Cyclone">Cyclone</SelectItem>
                      <SelectItem value="Tsunami">Tsunami</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., San Francisco, CA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="relevantData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relevant Data</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 24-hour rainfall: 150mm, river level: 5.2m"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Prediction...
                </>
              ) : (
                "Generate Prediction"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      {result && (
        <CardFooter className="flex-col items-start gap-4">
            <Alert>
              <AlertTitle className="font-headline">AI Analysis</AlertTitle>
              <AlertDescription>{result.description}</AlertDescription>
            </Alert>
          
          {result.chartData && result.chartData.length > 0 && (
            <div className="w-full h-80 mt-4">
            <h3 className="font-headline text-lg mb-2">Prediction Visualization</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={result.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
