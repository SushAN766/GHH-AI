'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/icons/logo';
import { DisputeContextualizer } from '@/components/features/dispute-contextualizer';
import { ResolutionSummary } from '@/components/features/resolution-summary';
import { EmpathyPrompting } from '@/components/features/empathy-prompting';
import { DocumentManager } from '@/components/features/document-manager';
import { Scale, MessageSquare, Files, Bot, HeartHandshake, LogOut, User } from 'lucide-react';
import { useAuth } from '@/components/features/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function Home() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Bot className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background font-body text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex items-center justify-between space-x-4 pb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-primary p-2 rounded-lg">
              <Logo className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-headline text-slate-800">
              Global Harmony Hub
            </h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {user?.photoURL ? (
                     <AvatarImage src={user.photoURL} alt={user.displayName ?? 'User'} />
                  ) : null}
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() ?? <User />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <Tabs defaultValue="context" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto md:h-10">
            <TabsTrigger value="context" className="text-xs sm:text-sm">
              <Bot className="mr-2 h-4 w-4" />
              Dispute Context
            </TabsTrigger>
            <TabsTrigger value="summary" className="text-xs sm:text-sm">
              <Scale className="mr-2 h-4 w-4" />
              Resolution Summary
            </TabsTrigger>
            <TabsTrigger value="empathy" className="text-xs sm:text-sm">
              <HeartHandshake className="mr-2 h-4 w-4" />
              Empathy Prompts
            </TabsTrigger>
            <TabsTrigger value="docs" className="text-xs sm:text-sm">
              <Files className="mr-2 h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="context" className="mt-6">
            <DisputeContextualizer />
          </TabsContent>
          <TabsContent value="summary" className="mt-6">
            <ResolutionSummary />
          </TabsContent>
          <TabsContent value="empathy" className="mt-6">
            <EmpathyPrompting />
          </TabsContent>
          <TabsContent value="docs" className="mt-6">
            <DocumentManager />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
