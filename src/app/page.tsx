'use client';

import { useSicboGame } from '@/hooks/use-sicbo-game';
import SetupBankroll from '@/components/sicbo/setup-bankroll';
import SetupPrimer from '@/components/sicbo/setup-primer';
import PlayingView from '@/components/sicbo/playing-view';

export default function SicBoProPage() {
  const game = useSicboGame();

  const renderContent = () => {
    switch (game.appState) {
      case 'SETUP_BANKROLL':
        return <SetupBankroll onBankrollSubmit={game.handleBankrollSubmit} />;
      case 'SETUP_PRIMER':
        return <SetupPrimer onPrimerSubmit={game.handlePrimerSubmit} />;
      case 'PLAYING':
        return <PlayingView {...game} />;
      default:
        // Fallback to the initial setup state
        return <SetupBankroll onBankrollSubmit={game.handleBankrollSubmit} />;
    }
  };

  return (
    <>
      {renderContent()}
    </>
  );
}
