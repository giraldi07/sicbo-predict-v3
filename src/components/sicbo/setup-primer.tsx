"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { History, TrendingUp, AlertCircle } from "lucide-react";
import type { DiceValue } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const diceSchema = z.coerce.number().int().min(1, "Harus 1-6").max(6, "Harus 1-6");

const formSchema = z.object({
  d1_0: diceSchema, d2_0: diceSchema, d3_0: diceSchema,
  d1_1: diceSchema, d2_1: diceSchema, d3_1: diceSchema,
  d1_2: diceSchema, d2_2: diceSchema, d3_2: diceSchema,
});

type SetupPrimerProps = {
  onPrimerSubmit: (primerData: { d1: DiceValue, d2: DiceValue, d3: DiceValue }[]) => void;
};

export default function SetupPrimer({ onPrimerSubmit }: SetupPrimerProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newHistory = [];
    for (let i = 0; i < 3; i++) {
      const d1 = values[`d1_${i}` as keyof typeof values] as DiceValue;
      const d2 = values[`d2_${i}` as keyof typeof values] as DiceValue;
      const d3 = values[`d3_${i}` as keyof typeof values] as DiceValue;
      
      if (!d1 || !d2 || !d3) {
        toast({ variant: 'destructive', title: "Input Tidak Lengkap", description: "Pastikan semua mata dadu diisi dengan angka 1-6!" });
        return;
      }
      newHistory.push({ d1, d2, d3 });
    }
    onPrimerSubmit(newHistory);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-gray-700 bg-card shadow-2xl shadow-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <History className="w-8 h-8 text-primary" />
            <CardTitle className="font-headline text-2xl text-primary">Input Data Primer</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-blue-900/30 border-blue-500/30 text-blue-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Analisa Awal</AlertTitle>
            <AlertDescription>
              Agar AI dapat memprediksi pola awal, masukkan <strong>3 hasil putaran dadu terakhir</strong> yang terjadi di meja secara berurutan.
            </AlertDescription>
          </Alert>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="bg-background/50 p-4 rounded-lg border">
                  <FormLabel className="block text-sm font-medium text-muted-foreground mb-3">Putaran Sebelumnya ke-{i + 1}</FormLabel>
                  <div className="flex gap-4 justify-center">
                    {[1, 2, 3].map((d) => (
                      <FormField
                        key={d}
                        control={form.control}
                        name={`d${d}_${i}` as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                min="1" max="6" required
                                className="w-16 h-16 text-center text-2xl font-black font-code bg-card border-2 border-input focus:border-primary focus:ring-2 focus:ring-ring transition-all"
                                placeholder="-"
                                {...field}
                                value={field.value ?? ''}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20"
                size="lg"
              >
                Analisa & Mulai Prediksi <TrendingUp className="w-6 h-6" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
