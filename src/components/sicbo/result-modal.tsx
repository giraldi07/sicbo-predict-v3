"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { DiceValue } from "@/lib/types";
import { cn } from "@/lib/utils";

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

  const canSubmit = d1 !== null && d2 !== null && d3 !== null;

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal is closed
      setTimeout(() => {
        setD1(null);
        setD2(null);
        setD3(null);
      }, 200); // delay to allow for closing animation
    }
  }, [isOpen]);

  function handleFormSubmit() {
    if (canSubmit) {
      onSubmit(d1!, d2!, d3!);
    }
  }
  
  const DiceSelector = ({ label, value, onSelect }: { label: string, value: DiceValue | null, onSelect: (val: DiceValue) => void }) => (
    <div className="space-y-2">
      <p className="text-center text-sm font-medium text-muted-foreground">{label}</p>
      <div className="grid grid-cols-6 gap-2">
        {DICE_FACES.map((face) => (
          <Button
            key={face}
            variant="outline"
            size="icon"
            className={cn(
              "h-12 w-12 text-lg font-bold font-code border-2",
              value === face 
              ? "bg-primary text-primary-foreground border-primary-foreground/50 ring-2 ring-primary"
              : "bg-background hover:bg-accent"
            )}
            onClick={() => onSelect(face)}
          >
            {face}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-gray-700">
        <DialogHeader>
          <DialogTitle className="font-headline">Masukkan Hasil Aktual</DialogTitle>
          <DialogDescription>
            Pilih hasil dari ke-3 dadu yang baru saja keluar.
          </DialogDescription>
        </DialogHeader>
        
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
