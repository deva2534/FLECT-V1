import { PageHeader } from "@/components/page-header";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { educationContent, safetyActions } from "@/lib/data";
import { DisasterType } from "@/lib/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const disasterTypes: DisasterType[] = ["Flood", "Landslide", "Earthquake", "Cyclone", "Tsunami"];

export default function EducationPage() {
  return (
    <>
      <PageHeader
        title="Education & Safety"
        description="Stay prepared. Learn about different disasters and what to do."
      />
      <Tabs defaultValue="Flood" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          {disasterTypes.map((type) => (
            <TabsTrigger key={type} value={type}>{type}</TabsTrigger>
          ))}
        </TabsList>
        {disasterTypes.map((type) => {
          const content = educationContent[type];
          const actions = safetyActions[type];
          return (
            <TabsContent key={type} value={type} className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{content.title}</CardTitle>
                  <CardDescription>{content.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                      src={content.image}
                      alt={content.title}
                      data-ai-hint={content.dataAiHint}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-semibold mb-2">Disaster Basics</h3>
                    <p className="text-muted-foreground">{content.basics}</p>
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-semibold mb-2">What to Do</h3>
                    <Accordion type="single" collapsible className="w-full">
                        {actions.map(action => (
                            <AccordionItem key={action.step} value={`item-${action.step}`}>
                                <AccordionTrigger>Step {action.step}</AccordionTrigger>
                                <AccordionContent>
                                {action.action}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                  </div>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download Offline Safety PDF
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </>
  );
}
