'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import type { AppState, Bets, BetType, HistoryItem, Prediction, DiceValue } from '@/lib/types';
import { useToast } from "@/hooks/use-toast"
import { calculateSum, isBig, isSmall, isOdd, isEven, isLeopard, formatIDR } from '@/lib/utils';
import { enhancedAIPredictionExplanation, type EnhancedAIPredictionInput } from '@/ai/flows/enhanced-ai-prediction-explanation';

const PAYOUTS: Record<BetType, number> = {
  BIG: 1.97,
  SMALL: 1.97,
  ODD: 1.97,
  EVEN: 1.97,
  LEOPARD: 29,
}

const emptyBets: Bets = { BIG: 0, SMALL: 0, ODD: 0, EVEN: 0, LEOPARD: 0 };
const emptyProfitDetail: Bets = { BIG: 0, SMALL: 0, ODD: 0, EVEN: 0, LEOPARD: 0 };


export function useSicboGame() {
  const { toast } = useToast();
  
  const [appState, setAppState] = useState<AppState>('SETUP_BANKROLL');
  
  // Represents the bankroll at the *start* of the current betting round.
  const [bankroll, setBankroll] = useState(0); 
  const [initialBankroll, setInitialBankroll] = useState(0);
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [bets, setBets] = useState<Bets>(emptyBets);
  
  const [selectedChip, setSelectedChip] = useState<number | 'CUSTOM'>(160);
  const [customChip, setCustomChip] = useState(1600);
  
  const [prediction, setPrediction] = useState<Prediction>({ bigSmall: '-', oddEven: '-', leopardChance: 'Rendah', confidence: 0, explanation: 'Memuat prediksi...' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  // --- DERIVED STATE ---
  const currentTotalBet = useMemo(() => Object.values(bets).reduce((a, b) => a + b, 0), [bets]);
  
  // This is the bankroll available for betting, shown to the user in the header.
  const availableBankroll = useMemo(() => bankroll - currentTotalBet, [bankroll, currentTotalBet]);
  
  // This is the session profit, shown to the user in the header.
  const sessionProfit = useMemo(() => availableBankroll - initialBankroll, [availableBankroll, initialBankroll]);


  const updatePrediction = useCallback(async (hist: HistoryItem[]) => {
    setPrediction(prev => ({ ...prev, explanation: 'Menganalisa data baru...' }));
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
      setPrediction(prev => ({ ...prev, explanation: 'Gagal mendapatkan prediksi AI.' }));
      toast({
        variant: "destructive",
        title: "AI Prediction Error",
        description: "Tidak dapat mengambil prediksi dari AI.",
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
        bets: emptyBets,
        profit: 0,
        profitDetail: emptyProfitDetail,
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
    
    if (chipValue > availableBankroll) {
      toast({ variant: 'destructive', title: "Bankroll tidak mencukupi", description: `Anda memerlukan setidaknya ${formatIDR(chipValue)} untuk bet ini.` });
      return;
    }

    setBets(prevBets => {
        const newBets = { ...prevBets };
        // BIG and SMALL are mutually exclusive
        if (type === 'BIG' && newBets.SMALL > 0) newBets.SMALL = 0;
        else if (type === 'SMALL' && newBets.BIG > 0) newBets.BIG = 0;
        
        newBets[type] += chipValue;
        return newBets;
    });

  }, [selectedChip, customChip, availableBankroll, toast]);

  const clearBets = useCallback(() => {
    setBets(emptyBets);
  }, []);

  const handleResultSubmit = useCallback(async (d1: DiceValue, d2: DiceValue, d3: DiceValue) => {
    setIsSubmitting(true);
    const sum = calculateSum(d1, d2, d3);
    const resultOutcomes = {
      BIG: isBig(sum),
      SMALL: isSmall(sum),
      ODD: isOdd(sum),
      EVEN: isEven(sum),
      LEOPARD: isLeopard(d1, d2, d3),
    };

    let totalWinnings = 0;
    const profitDetail: Bets = { ...emptyProfitDetail };
    const totalStake = currentTotalBet;

    for (const betType in bets) {
        const key = betType as BetType;
        const betAmount = bets[key];

        if (betAmount > 0) {
            if (resultOutcomes[key]) {
                const payout = betAmount * PAYOUTS[key];
                totalWinnings += payout;
                profitDetail[key] = payout - betAmount;
            } else {
                profitDetail[key] = -betAmount;
            }
        }
    }
    
    const netProfit = totalWinnings - totalStake;
    
    // The bankroll was already reduced virtually by currentTotalBet.
    // We now commit the change by setting the new actual bankroll.
    const newBankroll = bankroll + netProfit;
    setBankroll(newBankroll);

    const newRecord: HistoryItem = {
      id: Date.now(),
      round: history.length + 1,
      d1, d2, d3, sum,
      isB: resultOutcomes.BIG, isS: resultOutcomes.SMALL, isO: resultOutcomes.ODD, isE: resultOutcomes.EVEN, isL: resultOutcomes.LEOPARD,
      bets: { ...bets },
      profit: netProfit,
      profitDetail: profitDetail
    };

    const newHistory = [...history, newRecord];
    setHistory(newHistory);
    
    await updatePrediction(newHistory);

    setBets(emptyBets);
    setShowResultModal(false);
    setIsSubmitting(false);

    if (totalStake > 0) {
      if (netProfit > 0) {
        toast({ title: "Menang!", description: `Profit bersih: ${formatIDR(netProfit)}`, className: "bg-primary text-primary-foreground border-primary" });
      } else if (netProfit < 0) {
        toast({ variant: "destructive", title: "Kalah", description: `Kerugian: ${formatIDR(Math.abs(netProfit))}` });
      } else {
        toast({ title: "Impas", description: "Tidak ada kemenangan atau kerugian." });
      }
    }
  }, [bets, history, toast, updatePrediction, bankroll, currentTotalBet]);

  return {
    appState,
    bankroll: availableBankroll,
    sessionProfit,
    history,
    bets,
    selectedChip,
    customChip,
    prediction,
    isSubmitting,
    showResultModal,
    currentTotalBet,
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
