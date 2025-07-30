"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getDisasterNews } from "@/services/news";
import { Article } from "@/lib/types";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ExternalLink, Loader2, Volume2, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { summarizeAndSpeak } from "@/ai/flows/summarize-and-speak";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";


const NewsSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent>
            <Skeleton className="w-full h-48" />
        </CardContent>
        <CardFooter>
            <Skeleton className="h-10 w-full" />
        </CardFooter>
    </Card>
);

export function LiveNewsCard() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [summarizingArticleUrl, setSummarizingArticleUrl] = useState<string | null>(null);
    const [playingAudioUrl, setPlayingAudioUrl] = useState<string | null>(null);
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const newsArticles = await getDisasterNews();
                setArticles(newsArticles);
            } catch (error) {
                console.error("Failed to fetch news:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not fetch live news.",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, [toast]);
    
     useEffect(() => {
        // Cleanup audio when component unmounts
        return () => {
            if (currentAudio) {
                currentAudio.pause();
            }
        };
    }, [currentAudio]);


    const handleSummarize = async (article: Article) => {
        setIsSubmitting(true);
        setSummarizingArticleUrl(article.url);
        setSummary(null);
        if (currentAudio) {
            currentAudio.pause();
            setPlayingAudioUrl(null);
        }

        try {
            const result = await summarizeAndSpeak({ text: article.content, source: article.url });
            setSummary(result.summary);

            const audio = new Audio(result.audioDataUri);
            setCurrentAudio(audio);
            setPlayingAudioUrl(article.url);
            audio.play();
            audio.onended = () => {
                setPlayingAudioUrl(null);
            };

        } catch (error) {
            console.error("Failed to summarize and generate audio:", error);
            toast({
                variant: "destructive",
                title: "AI Error",
                description: "Failed to generate audio summary. Please try again.",
            });
            setPlayingAudioUrl(null);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handlePlayPause = (articleUrl: string) => {
        if (playingAudioUrl === articleUrl && currentAudio) {
            currentAudio.pause();
            setPlayingAudioUrl(null);
        } else if (summary && currentAudio) {
            // This case is for re-playing the same audio
             currentAudio.play();
             setPlayingAudioUrl(articleUrl);
        }
    }

  return (
    <div className="space-y-8">
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => <NewsSkeleton key={i} />)
      ) : (
        articles.map((article) => (
          <Card key={article.url}>
            <CardHeader>
                <CardDescription>
                    {article.source.name} &bull;{" "}
                     {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                </CardDescription>
              <CardTitle className="font-headline text-xl">
                {article.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{article.description}</p>
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  data-ai-hint={article.dataAiHint}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
               {summarizingArticleUrl === article.url && summary && (
                    <Alert>
                        <AlertTitle className="font-headline">AI Summary</AlertTitle>
                        <AlertDescription>{summary}</AlertDescription>
                    </Alert>
               )}
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4">
                <Button 
                    onClick={() => handleSummarize(article)} 
                    disabled={isSubmitting}
                >
                    {isSubmitting && summarizingArticleUrl === article.url ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Audio...
                        </>
                    ) : playingAudioUrl === article.url ? (
                        <>
                            <Pause className="mr-2 h-4 w-4" />
                            Pause Summary
                        </>
                    ) : (
                        <>
                            <Volume2 className="mr-2 h-4 w-4" />
                            Summarize & Listen
                        </>
                    )}
                </Button>
                <Button variant="secondary" asChild>
                    <Link href={article.url} target="_blank">
                        Read Full Article
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
