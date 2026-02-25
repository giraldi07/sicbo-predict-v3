"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { DiceValue } from "@/lib/types";

const diceSchema = z.coerce.number().int().min(1).max(6);
const formSchema = z.object({
  d1: diceSchema,
  d2: diceSchema,
  d3: diceSchema,
});

type ResultModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (d1: DiceValue, d2: DiceValue, d3: DiceValue) => void;
  isSubmitting: boolean;
};

export default function ResultModal({ isOpen, onClose, onSubmit, isSubmitting }: ResultModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values.d1 as DiceValue, values.d2 as DiceValue, values.d3 as DiceValue);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-gray-700">
        <DialogHeader>
          <DialogTitle className="font-headline">Masukkan Hasil Aktual</DialogTitle>
          <DialogDescription>
            Lihat meja SicBo dan masukkan hasil ke-3 dadu yang baru saja keluar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            <div className="flex gap-4 justify-center">
              {[1, 2, 3].map((num) => (
                <FormField
                  key={num}
                  control={form.control}
                  name={`d${num}` as "d1" | "d2" | "d3"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          min="1" max="6" required
                          placeholder="-"
                          className="w-20 h-20 text-center text-3xl font-black font-code bg-background border-2 border-primary rounded-xl focus:ring-4 focus:ring-ring transition-all"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Memproses..." : "Proses Hasil"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
