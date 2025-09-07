"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Lightbulb } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { invokeSuggestEmpathyPrompts } from '@/app/actions';
import type { SuggestEmpathyPromptsOutput } from '@/ai/flows/suggest-empathy-prompts';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  disputeDetails: z.string().min(10, { message: 'Dispute details must be at least 10 characters.' }),
  partyAContext: z.string().min(10, { message: "Party A's context must be at least 10 characters." }),
  partyBContext: z.string().min(10, { message: "Party B's context must be at least 10 characters." }),
});

export function EmpathyPrompting() {
  const [result, setResult] = useState<SuggestEmpathyPromptsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      disputeDetails: '',
      partyAContext: '',
      partyBContext: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    const response = await invokeSuggestEmpathyPrompts(values);
    setIsLoading(false);
    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error || 'An unexpected error occurred.',
      });
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Empathy Prompts</CardTitle>
          <CardDescription>
            Encourage understanding and constructive communication between parties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="disputeDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dispute Details</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the core conflict." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="partyAContext"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Party A's Perspective</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Context for Party A (their views, feelings, cultural background)." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="partyBContext"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Party B's Perspective</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Context for Party B (their views, feelings, cultural background)." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating...' : 'Generate Prompts'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Prompts for Party A</CardTitle>
              <CardDescription>Suggestions to help Party A understand Party B.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
                ) : (
                  result?.partyAPrompts.map((prompt, index) => (
                    <li key={index} className="flex items-start">
                      <Lightbulb className="h-5 w-5 mr-3 mt-1 shrink-0 text-accent" />
                      <span className="text-sm text-muted-foreground">{prompt}</span>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Prompts for Party B</CardTitle>
              <CardDescription>Suggestions to help Party B understand Party A.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
                ) : (
                  result?.partyBPrompts.map((prompt, index) => (
                    <li key={index} className="flex items-start">
                      <Lightbulb className="h-5 w-5 mr-3 mt-1 shrink-0 text-accent" />
                      <span className="text-sm text-muted-foreground">{prompt}</span>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
