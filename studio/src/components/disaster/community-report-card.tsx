"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, FileWarning, CheckCircle, ShieldAlert } from "lucide-react";
import Image from "next/image";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { analyzeCommunityReport } from "@/ai/flows/community-report-analysis";
import type { CommunityReportOutput } from "@/ai/flows/community-report-analysis";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  description: z.string().min(10, "Please provide a detailed description."),
  photo: z.any().refine((file) => file instanceof FileList && file.length > 0, "A photo is required."),
  location: z.string().min(2, "Location is required (e.g., street name, landmark)."),
});

const toDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export function CommunityReportCard({ disasterType }: { disasterType: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CommunityReportOutput | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      location: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const photoFile = values.photo[0];
      const photoDataUri = await toDataURL(photoFile);

      const analysis = await analyzeCommunityReport({
        description: values.description,
        photoDataUri,
        location: values.location,
        disasterType,
      });

      setResult(analysis);
      toast({
        title: "Report Analyzed",
        description: "Your report has been successfully analyzed by our AI.",
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred while analyzing your report.",
      });
    } finally {
      setLoading(false);
    }
  }
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    } else {
        setPhotoPreview(null);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Community Incident Reporting</CardTitle>
        <CardDescription>
          Report an incident in your area. Your report will be analyzed by our AI to assess the situation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the situation..." {...field} />
                  </FormControl>
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
                    <Input placeholder="e.g., Near City Park" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={(e) => {
                        field.onChange(e.target.files);
                        handlePhotoChange(e);
                    }} />
                  </FormControl>
                  <FormDescription>A photo helps us understand the severity.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {photoPreview && (
                <div className="relative w-full h-48 rounded-md overflow-hidden border">
                    <Image src={photoPreview} alt="Photo preview" layout="fill" objectFit="cover" />
                </div>
            )}
             <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Report...
                </>
              ) : (
                "Submit & Analyze Report"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      {result && (
        <CardFooter className="flex-col items-start gap-4">
            <Alert variant={result.emergingSituation ? "destructive" : "default"}>
                {result.emergingSituation ? <ShieldAlert className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                <AlertTitle className="font-headline">AI Analysis Summary</AlertTitle>
                <AlertDescription>{result.summary}</AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-center">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Severity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold font-headline">{result.severity}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Confidence</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold font-headline">{(result.confidence * 100).toFixed(0)}%</p>
                        <Progress value={result.confidence * 100} className="mt-2 h-2" />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Emerging Situation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold font-headline">{result.emergingSituation ? 'Yes' : 'No'}</p>
                    </CardContent>
                </Card>
            </div>
        </CardFooter>
      )}
    </Card>
  );
}
