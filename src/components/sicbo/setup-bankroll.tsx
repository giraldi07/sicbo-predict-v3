"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Play } from "lucide-react";

const formSchema = z.object({
  bankroll: z.coerce.number().min(1000, "Bankroll awal minimal Rp 1.000"),
});

type SetupBankrollProps = {
  onBankrollSubmit: (value: number) => void;
};

export default function SetupBankroll({ onBankrollSubmit }: SetupBankrollProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onBankrollSubmit(values.bankroll);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-700 bg-card shadow-2xl shadow-primary/10">
        <CardHeader className="items-center text-center">
          <div className="bg-primary p-4 rounded-full shadow-lg mb-4">
            <Calculator className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="font-headline text-3xl text-primary">SicBo Pro</CardTitle>
          <CardDescription className="text-muted-foreground">
            Masukkan bankroll (saldo) awal Anda untuk memulai permainan dan melacak profit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="bankroll"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Bankroll Awal (Rp)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Contoh: 500000"
                        className="h-12 text-base font-code"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-12 text-lg font-bold" size="lg">
                Mulai Sesi
                <Play className="w-5 h-5" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
