"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Copy, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { invokeGenerateResolutionSummary } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  disputeDetails: z.string().min(10, {
    message: 'Dispute details must be at least 10 characters.',
  }),
  suggestedResolutions: z.string().min(10, {
    message: 'Suggested resolutions must be at least 10 characters.',
  }),
  jurisdiction: z.string().min(2, {
    message: 'Jurisdiction must be at least 2 characters.',
  }),
  culturalContext: z.string().min(2, {
    message: 'Cultural context must be at least 2 characters.',
  }),
});

export function ResolutionSummary() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      disputeDetails: '',
      suggestedResolutions: '',
      jurisdiction: '',
      culturalContext: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    const response = await invokeGenerateResolutionSummary(values);
    setIsLoading(false);
    if (response.success && response.data) {
      setResult(response.data.resolutionSummary);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error || 'An unexpected error occurred.',
      });
    }
  }

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Generate Resolution Summary</CardTitle>
          <CardDescription>
            Create an easily understandable, jurisdiction-aware resolution summary.
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
                      <Textarea placeholder="Provide detailed information about the dispute." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="suggestedResolutions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suggested Resolutions</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List the resolutions that have been suggested." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jurisdiction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jurisdiction</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., New York State Law" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="culturalContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cultural Context</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., Japanese corporate culture" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating...' : 'Generate Summary'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Resolution Summary</CardTitle>
            <CardDescription>
              A clear, concise, and culturally sensitive summary of resolutions.
            </CardDescription>
          </div>
          {result && (
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert min-h-[300px] rounded-md border border-dashed border-border p-4">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[75%]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            ) : result ? (
              <p className="whitespace-pre-wrap">{result}</p>
            ) : (
              <p className="text-muted-foreground">The generated resolution summary will appear here.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
