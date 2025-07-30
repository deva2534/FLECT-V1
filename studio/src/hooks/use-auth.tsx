
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  onAuthStateChanged, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from './use-toast';
import { SignUpData, SignInData } from '@/lib/types';
import { Loader2 } from 'lucide-react';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (data: SignUpData) => Promise<void>;
  signInWithEmail: (data: SignInData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);


  const signInWithGoogle = async () => {
    setLoading(true);
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        toast({ title: "Success", description: "Signed in successfully with Google." });
        router.push('/dashboard');
    } catch (error: any) {
        console.error("Google sign-in error:", error);
        toast({ variant: "destructive", title: "Auth Error", description: error.message });
    } finally {
        // In the case of popup, loading should be false after completion/error
        setLoading(false);
    }
  };

  const signUpWithEmail = async (data: SignUpData) => {
    setLoading(true);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await updateProfile(userCredential.user, { displayName: data.name });
        setUser(userCredential.user);
        toast({ title: "Success", description: "Account created successfully." });
        router.push('/dashboard');
    } catch (error: any) {
        console.error("Error during sign-up:", error);
        toast({ variant: "destructive", title: "Sign-up Error", description: error.message });
        setLoading(false);
    }
  };

  const signInWithEmail = async (data: SignInData) => {
      setLoading(true);
      try {
          await signInWithEmailAndPassword(auth, data.email, data.password);
          toast({ title: "Success", description: "Signed in successfully." });
          router.push('/dashboard');
      } catch (error: any) {
          console.error("Error during sign-in:", error);
          toast({ variant: "destructive", title: "Sign-in Error", description: error.message });
          setLoading(false);
      }
  };

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    router.push('/');
    toast({ title: "Success", description: "You have been logged out."});
    // setLoading is set to false by onAuthStateChanged
  };

  const value = { user, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
             <div className="flex items-center justify-center h-screen bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    if (!user) {
        // While waiting for redirect in useEffect
        return (
            <div className="flex items-center justify-center h-screen bg-background">
               <Loader2 className="h-12 w-12 animate-spin text-primary" />
           </div>
       ); 
    }

    return <>{children}</>;
};
