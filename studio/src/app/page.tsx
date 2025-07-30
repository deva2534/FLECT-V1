
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Siren, Waves, Wind, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { SignUpData, SignInData } from "@/lib/types";

const GoogleIcon = () => (
    <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
      <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 256S109.8 0 244 0c86.6 0 160.2 43.6 201.2 113.3l-67.8 52.9C343.3 118.4 298.6 96 244 96c-82.6 0-149.3 67.1-149.3 150s66.7 150 149.3 150c95.8 0 128.9-63.5 133.5-95.2H244v-64.2h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path>
    </svg>
);

const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LandingPage() {
  const { signUpWithEmail, signInWithEmail, loading } = useAuth();

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSignUp = (data: SignUpData) => {
    signUpWithEmail(data);
  };

  const onSignIn = (data: SignInData) => {
    signInWithEmail(data);
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="hidden bg-sidebar lg:flex flex-col justify-center items-center p-12 text-center relative overflow-hidden">
        <div className="absolute top-10 left-10 text-primary">
            <Siren className="h-12 w-12" />
        </div>
        <h1 className="text-6xl font-headline font-bold text-primary">FLECT</h1>
        <p className="mt-4 text-2xl font-semibold text-foreground max-w-md">
            In Latin, FLECT means 'to bend'. <br /> Our goal: To bend disaster impact away from people and communities.
        </p>
        <p className="mt-4 text-muted-foreground max-w-lg">
            (Addressing Floods, Landslides, Earthquakes, Cyclones & Tsunamis)
        </p>
        <p className="mt-20 text-lg font-medium italic text-muted-foreground/80 max-w-sm">
            &quot;Your code could save lives. Join us in building disaster resilience.&quot;
        </p>
         <div className="absolute -bottom-16 -right-16 text-primary/5 opacity-30">
            <Wind size={200} strokeWidth={1} />
        </div>
         <div className="absolute -bottom-16 -left-16 text-primary/5 opacity-30">
            <Waves size={200} strokeWidth={1} />
        </div>
      </div>
      <div className="flex items-center justify-center py-12 min-h-screen bg-background">
        <div className="mx-auto grid w-[380px] gap-6">
          <div className="grid gap-2 text-center lg:hidden">
            <Siren className="h-10 w-10 text-primary mx-auto" />
            <h1 className="text-3xl font-bold font-headline">FLECT</h1>
            <p className="text-balance text-muted-foreground">
              Sign in or create an account to continue
            </p>
          </div>
           <Card>
            <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>Create an account to continue.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin" className="pt-4">
                        <Form {...signInForm}>
                            <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                                <FormField control={signInForm.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input placeholder="m@example.com" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={signInForm.control} name="password" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl><Input type="password" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Sign In
                                </Button>
                            </form>
                        </Form>
                    </TabsContent>
                    <TabsContent value="signup" className="pt-4">
                        <Form {...signUpForm}>
                            <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                                <FormField control={signUpForm.control} name="name" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                 <FormField control={signUpForm.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl><Input placeholder="m@example.com" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={signUpForm.control} name="password" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl><Input type="password" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Account
                                </Button>
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>
            </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
