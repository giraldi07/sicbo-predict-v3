'use client';

import { useSicboGame } from '@/hooks/use-sicbo-game';
import SetupBankroll from '@/components/sicbo/setup-bankroll';
import SetupPrimer from '@/components/sicbo/setup-primer';
import PlayingView from '@/components/sicbo/playing-view';
import { AnimatePresence } from 'framer-motion';

export default function SicBoProPage() {
  const game = useSicboGame();

  const renderContent = () => {
    switch (game.appState) {
      case 'SETUP_BANKROLL':
        return <SetupBankroll key="setup-bankroll" onBankrollSubmit={game.handleBankrollSubmit} />;
      case 'SETUP_PRIMER':
        return <SetupPrimer key="setup-primer" onPrimerSubmit={game.handlePrimerSubmit} />;
      case 'PLAYING':
        return <PlayingView key="playing" {...game} />;
      default:
        return <SetupBankroll key="fallback-bankroll" onBankrollSubmit={game.handleBankrollSubmit} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {renderContent()}
    </AnimatePresence>
  );
}
