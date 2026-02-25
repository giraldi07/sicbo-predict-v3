"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { DiceValue } from "@/lib/types";
import Dice from "./dice";
import { motion, AnimatePresence } from "framer-motion";

type ResultModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (d1: DiceValue, d2: DiceValue, d3: DiceValue) => void;
  isSubmitting: boolean;
};

const DICE_FACES: DiceValue[] = [1, 2, 3, 4, 5, 6];

export default function ResultModal({ isOpen, onClose, onSubmit, isSubmitting }: ResultModalProps) {
  const [d1, setD1] = useState<DiceValue | null>(null);
  const [d2, setD2] = useState<DiceValue | null>(null);
  const [d3, setD3] = useState<DiceValue | null>(null);
  const [diceKey, setDiceKey] = useState(0); // Used to re-trigger animation

  const canSubmit = d1 !== null && d2 !== null && d3 !== null;

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setD1(null);
        setD2(null);
        setD3(null);
      }, 300);
    }
  }, [isOpen]);

  function handleFormSubmit() {
    if (canSubmit) {
      onSubmit(d1!, d2!, d3!);
    }
  }

  const handleSelect = (setter: React.Dispatch<React.SetStateAction<DiceValue | null>>, value: DiceValue) => {
    setter(value);
    setDiceKey(prev => prev + 1); // Re-mount the Dice component to animate
  };

  const DiceSelector = ({ label, value, onSelect }: { label: string, value: DiceValue | null, onSelect: (val: DiceValue) => void }) => (
    <div className="space-y-3">
      <p className="text-center text-sm font-medium text-muted-foreground">{label}</p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {DICE_FACES.map((face) => (
          <motion.button
            key={face}
            onClick={() => handleSelect(onSelect as any, face)}
            className={`flex justify-center items-center rounded-lg transition-colors duration-200 ${value === face ? 'bg-primary/20 ring-2 ring-primary' : 'bg-accent/50 hover:bg-accent'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Dice value={face} className="w-12 h-12" />
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-headline">Masukkan Hasil Aktual</DialogTitle>
          <DialogDescription>
            Pilih hasil dari ke-3 dadu yang baru saja keluar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 flex flex-col items-center">
            <div className="flex gap-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${diceKey}-d1-${d1}`}
                  initial={{ rotateY: -90, opacity: 0, scale: 0.8 }}
                  animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                  exit={{ rotateY: 90, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dice value={d1 || 1} className={`w-16 h-16 transition-opacity ${d1 === null ? 'opacity-30' : ''}`} />
                </motion.div>
                 <motion.div
                  key={`${diceKey}-d2-${d2}`}
                  initial={{ rotateY: -90, opacity: 0, scale: 0.8 }}
                  animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                  exit={{ rotateY: 90, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Dice value={d2 || 1} className={`w-16 h-16 transition-opacity ${d2 === null ? 'opacity-30' : ''}`} />
                </motion.div>
                 <motion.div
                  key={`${diceKey}-d3-${d3}`}
                  initial={{ rotateY: -90, opacity: 0, scale: 0.8 }}
                  animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                  exit={{ rotateY: 90, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Dice value={d3 || 1} className={`w-16 h-16 transition-opacity ${d3 === null ? 'opacity-30' : ''}`} />
                </motion.div>
              </AnimatePresence>
            </div>
        </div>
        
        <div className="space-y-6 py-4">
          <DiceSelector label="Dadu 1" value={d1} onSelect={setD1} />
          <DiceSelector label="Dadu 2" value={d2} onSelect={setD2} />
          <DiceSelector label="Dadu 3" value={d3} onSelect={setD3} />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button type="button" onClick={handleFormSubmit} disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Memproses..." : "Proses Hasil"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
