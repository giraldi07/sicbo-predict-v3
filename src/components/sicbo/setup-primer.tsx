"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { History, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import type { DiceValue } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Dice from "./dice";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type PrimerRow = [DiceValue | null, DiceValue | null, DiceValue | null];

type SetupPrimerProps = {
  onPrimerSubmit: (primerData: { d1: DiceValue, d2: DiceValue, d3: DiceValue }[]) => void;
};

const DICE_FACES: DiceValue[] = [1, 2, 3, 4, 5, 6];

export default function SetupPrimer({ onPrimerSubmit }: SetupPrimerProps) {
  const { toast } = useToast();
  const [primerData, setPrimerData] = useState<PrimerRow[]>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);

  const isComplete = primerData.every(row => row.every(cell => cell !== null));

  const handleDiceSelect = (rowIndex: number, diceIndex: number, value: DiceValue) => {
    setPrimerData(prevData => {
      const newData = [...prevData] as PrimerRow[];
      newData[rowIndex][diceIndex] = value;
      return newData;
    });
  };

  function onSubmit() {
    if (!isComplete) {
      toast({ variant: 'destructive', title: "Input Tidak Lengkap", description: "Pastikan semua 9 mata dadu telah diisi!" });
      return;
    }
    const newHistory = primerData.map(row => ({
      d1: row[0]!,
      d2: row[1]!,
      d3: row[2]!,
    }));
    onPrimerSubmit(newHistory);
  }

  const DiceSlot = ({ value, rowIndex, diceIndex }: { value: DiceValue | null, rowIndex: number, diceIndex: number }) => (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center transition-all duration-300 ${value ? 'bg-background' : 'bg-muted/50 border-2 border-dashed'}`}
        >
          {value ? <Dice value={value} className="w-full h-full p-2" /> : <span className="text-muted-foreground text-3xl font-bold">?</span>}
        </motion.button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="grid grid-cols-3 gap-2">
          {DICE_FACES.map(face => (
            <Button
              key={face}
              variant={value === face ? "default" : "outline"}
              size="icon"
              className="w-14 h-14"
              onClick={() => handleDiceSelect(rowIndex, diceIndex, face)}
            >
              <Dice value={face} className="w-10 h-10" />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center bg-background p-4"
    >
      <Card className="w-full max-w-2xl border-border bg-card shadow-2xl shadow-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <History className="w-8 h-8 text-primary" />
            <CardTitle className="font-headline text-2xl text-primary">Input Data Primer</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-blue-900/20 border-blue-500/30 text-blue-300 dark:bg-blue-900/30 dark:border-blue-500/30 dark:text-blue-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Analisa Awal</AlertTitle>
            <AlertDescription>
              Agar AI dapat memprediksi pola awal, masukkan <strong>3 hasil putaran dadu terakhir</strong> yang terjadi di meja secara berurutan.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-6">
            {primerData.map((row, rowIndex) => (
              <motion.div
                key={rowIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.1 }}
                className="bg-background/50 p-4 rounded-lg border flex items-center justify-between"
              >
                <div className="font-medium text-muted-foreground">
                  Putaran ke-{rowIndex + 1}
                  {row.every(cell => cell !== null) && <CheckCircle className="w-5 h-5 text-green-500 inline-block ml-2"/>}
                </div>
                <div className="flex gap-2 sm:gap-4 justify-center">
                  {row.map((cell, diceIndex) => (
                    <DiceSlot key={diceIndex} value={cell} rowIndex={rowIndex} diceIndex={diceIndex} />
                  ))}
                </div>
              </motion.div>
            ))}
            <Button
              onClick={onSubmit}
              disabled={!isComplete}
              className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 disabled:shadow-none"
              size="lg"
            >
              Analisa & Mulai Prediksi <TrendingUp className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
