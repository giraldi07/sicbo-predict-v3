"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Play } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  bankroll: z.coerce.number().min(1000, "Bankroll awal minimal Rp 1.000"),
});

type SetupBankrollProps = {
  onBankrollSubmit: (value: number) => void;
};

export default function SetupBankroll({ onBankrollSubmit }: SetupBankrollProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankroll: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onBankrollSubmit(values.bankroll);
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center bg-background p-4"
    >
      <Card className="w-full max-w-md border-border bg-card shadow-2xl shadow-primary/10">
        <CardHeader className="items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="bg-primary p-4 rounded-full shadow-lg mb-4"
          >
            <Calculator className="w-10 h-10 text-primary-foreground" />
          </motion.div>
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
                <Play className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
