"use client";

import { useState, useCallback, useMemo } from 'react';
import type { AppState, Bets, BetType, HistoryItem, Prediction, DiceValue } from '@/lib/types';
import { useToast } from "@/hooks/use-toast"
import { calculateSum, isBig, isSmall, isOdd, isEven, isLeopard } from '@/lib/utils';
import { enhancedAIPredictionExplanation, type EnhancedAIPredictionInput } from '@/ai/flows/enhanced-ai-prediction-explanation';

const PAYOUTS = {
  BIG: 1.97,
  SMALL: 1.97,
  ODD: 1.97,
  EVEN: 1.97,
  LEOPARD: 29,
}

export function useSicboGame() {
  const { toast } = useToast();
  
  const [appState, setAppState] = useState<AppState>('SETUP_BANKROLL');
  const [bankroll, setBankroll] = useState(0);
  const [initialBankroll, setInitialBankroll] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [bets, setBets] = useState<Bets>({ BIG: 0, SMALL: 0, ODD: 0, EVEN: 0, LEOPARD: 0 });
  const [selectedChip, setSelectedChip] = useState<number | 'CUSTOM'>(1000);
  const [customChip, setCustomChip] = useState(10000);
  const [prediction, setPrediction] = useState<Prediction>({ bigSmall: '-', oddEven: '-', leopardChance: 'Rendah', confidence: 0, explanation: 'Memuat prediksi...' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const updatePrediction = useCallback(async (hist: HistoryItem[]) => {
    const historyForAI = hist.map(({ round, d1, d2, d3, sum, isB, isS, isO, isE, isL }) => ({
      round, d1, d2, d3, sum, isB, isS, isO, isE, isL
    }));
    
    try {
      const result = await enhancedAIPredictionExplanation({ history: historyForAI.slice(-10) as EnhancedAIPredictionInput['history'] });
      if(result) {
        setPrediction({
            bigSmall: result.bigSmall,
            oddEven: result.oddEven,
            leopardChance: result.leopardChance,
            confidence: result.confidence,
            explanation: result.explanation
        });
      }
    } catch (error) {
      console.error("AI Prediction failed:", error);
      toast({
        variant: "destructive",
        title: "AI Prediction Error",
        description: "Could not fetch prediction from the AI.",
      });
    }
  }, [toast]);

  const handleBankrollSubmit = useCallback((value: number) => {
    if (value > 0) {
      setBankroll(value);
      setInitialBankroll(value);
      setAppState('SETUP_PRIMER');
    }
  }, []);

  const handlePrimerSubmit = useCallback((primerData: { d1: DiceValue, d2: DiceValue, d3: DiceValue }[]) => {
    const newHistory: HistoryItem[] = primerData.map((item, i) => {
      const sum = calculateSum(item.d1, item.d2, item.d3);
      return {
        id: Date.now() + i,
        round: i + 1,
        d1: item.d1, d2: item.d2, d3: item.d3, sum,
        isB: isBig(sum), isS: isSmall(sum),
        isO: isOdd(sum), isE: isEven(sum),
        isL: isLeopard(item.d1, item.d2, item.d3),
        bets: { BIG: 0, SMALL: 0, ODD: 0, EVEN: 0, LEOPARD: 0 },
        profit: 0
      };
    });
    setHistory(newHistory);
    updatePrediction(newHistory);
    setAppState('PLAYING');
    toast({
      title: "Analisa Awal Selesai!",
      description: "Prediksi pertama Anda siap.",
      className: "bg-primary text-primary-foreground border-primary"
    });
  }, [updatePrediction, toast]);

  const handlePlaceBet = useCallback((type: BetType) => {
    const chipValue = selectedChip === 'CUSTOM' ? customChip : selectedChip;
    
    if (bankroll < chipValue) {
      toast({ variant: 'destructive', title: "Bankroll tidak mencukupi", description: `Anda memerlukan setidaknya ${chipValue} untuk bet ini.` });
      return;
    }

    setBets(prevBets => {
        let newBets = { ...prevBets };
        let refund = 0;

        if (type === 'BIG' && newBets.SMALL > 0) {
            refund += newBets.SMALL;
            newBets.SMALL = 0;
        } else if (type === 'SMALL' && newBets.BIG > 0) {
            refund += newBets.BIG;
            newBets.BIG = 0;
        }

        newBets[type] += chipValue;
        setBankroll(prevBankroll => prevBankroll + refund - chipValue);
        return newBets;
    });

  }, [selectedChip, customChip, bankroll, toast]);

  const clearBets = useCallback(() => {
    const totalBets = Object.values(bets).reduce((a, b) => a + b, 0);
    setBankroll(prev => prev + totalBets);
    setBets({ BIG: 0, SMALL: 0, ODD: 0, EVEN: 0, LEOPARD: 0 });
  }, [bets]);

  const handleResultSubmit = useCallback(async (d1: DiceValue, d2: DiceValue, d3: DiceValue) => {
    setIsSubmitting(true);
    const sum = calculateSum(d1, d2, d3);
    const res = {
      B: isBig(sum),
      S: isSmall(sum),
      O: isOdd(sum),
      E: isEven(sum),
      L: isLeopard(d1, d2, d3),
    };

    let totalWinPayout = 0;
    let totalBetAmount = 0;

    if (bets.BIG > 0) { totalBetAmount += bets.BIG; if (res.B) totalWinPayout += bets.BIG * PAYOUTS.BIG; }
    if (bets.SMALL > 0) { totalBetAmount += bets.SMALL; if (res.S) totalWinPayout += bets.SMALL * PAYOUTS.SMALL; }
    if (bets.ODD > 0) { totalBetAmount += bets.ODD; if (res.O) totalWinPayout += bets.ODD * PAYOUTS.ODD; }
    if (bets.EVEN > 0) { totalBetAmount += bets.EVEN; if (res.E) totalWinPayout += bets.EVEN * PAYOUTS.EVEN; }
    if (bets.LEOPARD > 0) { totalBetAmount += bets.LEOPARD; if (res.L) totalWinPayout += bets.LEOPARD * PAYOUTS.LEOPARD; }

    const netProfit = totalWinPayout - totalBetAmount;
    
    setBankroll(prev => prev + totalWinPayout);

    const newRecord: HistoryItem = {
      id: Date.now(),
      round: history.length + 1,
      d1, d2, d3, sum,
      isB: res.B, isS: res.S, isO: res.O, isE: res.E, isL: res.L,
      bets: { ...bets },
      profit: netProfit
    };

    const newHistory = [...history, newRecord];
    setHistory(newHistory);
    
    await updatePrediction(newHistory);

    setBets({ BIG: 0, SMALL: 0, ODD: 0, EVEN: 0, LEOPARD: 0 });
    setShowResultModal(false);
    setIsSubmitting(false);

    if (netProfit > 0) {
      toast({ title: "Menang!", description: `Profit bersih: ${netProfit}`, className: "bg-primary text-primary-foreground border-primary" });
    } else if (netProfit < 0) {
      toast({ variant: "destructive", title: "Kalah", description: `Kerugian: ${Math.abs(netProfit)}` });
    } else if (totalBetAmount > 0) {
      toast({ title: "Impas", description: "Taruhan Anda dikembalikan." });
    }
  }, [bets, history, toast, updatePrediction]);

  const currentTotalBet = useMemo(() => Object.values(bets).reduce((a, b) => a + b, 0), [bets]);
  const sessionProfit = useMemo(() => bankroll - initialBankroll, [bankroll, initialBankroll]);

  return {
    appState,
    bankroll,
    initialBankroll,
    history,
    bets,
    selectedChip,
    customChip,
    prediction,
    isSubmitting,
    showResultModal,
    currentTotalBet,
    sessionProfit,
    handleBankrollSubmit,
    handlePrimerSubmit,
    handlePlaceBet,
    clearBets,
    handleResultSubmit,
    setSelectedChip,
    setCustomChip,
    setShowResultModal,
  }
}
