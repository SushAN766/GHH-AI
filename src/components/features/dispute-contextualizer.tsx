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
  FormDescription,
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
import { invokeSummarizeDisputeContext } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  disputeDetails: z.string().min(10, {
    message: 'Dispute details must be at least 10 characters.',
  }),
  culturalContext: z.string().min(2, {
    message: 'Cultural context must be at least 2 characters.',
  }),
  jurisdictionalContext: z.string().min(2, {
    message: 'Jurisdictional context must be at least 2 characters.',
  }),
});

export function DisputeContextualizer() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      disputeDetails: '',
      culturalContext: '',
      jurisdictionalContext: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    const response = await invokeSummarizeDisputeContext(values);
    setIsLoading(false);
    if (response.success && response.data) {
      setResult(response.data.summary);
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
          <CardTitle>Analyze Dispute</CardTitle>
          <CardDescription>
            Provide details about the dispute to generate a culturally sensitive summary.
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
                      <Textarea
                        placeholder="Describe the dispute in detail, including all relevant facts and perspectives..."
                        className="min-h-[150px]"
                        {...field}
                      />
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
                      <Input type="text" placeholder="e.g., High-context vs. low-context communication styles" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jurisdictionalContext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jurisdictional Context</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g., Common Law, Civil Law, based in California, USA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Analyzing...' : 'Generate Summary'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>AI-Generated Summary</CardTitle>
            <CardDescription>
              A neutral summary highlighting agreement and disagreement.
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
              <p className="text-muted-foreground">The generated summary will appear here.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
