'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/features/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { FormEvent, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/icons/logo';

export default function LoginPage() {
  const { user, signIn, signUp, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleAuthAction = async (e: FormEvent, action: 'signIn' | 'signUp') => {
    e.preventDefault();
    setIsSigningIn(true);
    try {
      if (action === 'signIn') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: error.message,
      });
    } finally {
        setIsSigningIn(false);
    }
  };

  if (loading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Logo className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <div className="flex items-center space-x-4 pb-8">
          <div className="bg-primary p-2 rounded-lg">
            <Logo className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-headline text-slate-800">
            Global Harmony Hub
          </h1>
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button onClick={(e) => handleAuthAction(e, 'signIn')} type="submit" className="w-full" disabled={isSigningIn}>
              {isSigningIn ? 'Signing In...' : 'Sign In'}
            </Button>
            <Button onClick={(e) => handleAuthAction(e, 'signUp')} variant="outline" type="button" className="w-full" disabled={isSigningIn}>
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
