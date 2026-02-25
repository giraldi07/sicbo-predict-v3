import type { useSicboGame } from "@/hooks/use-sicbo-game";
import Header from "./header";
import AiPredictorCard from "./ai-predictor-card";
import ChipSelector from "./chip-selector";
import BettingBoard from "./betting-board";
import ActionBar from "./action-bar";
import HistoryTable from "./history-table";
import ResultModal from "./result-modal";

type PlayingViewProps = ReturnType<typeof useSicboGame>;

export default function PlayingView(props: PlayingViewProps) {
  return (
    <div className="min-h-screen bg-background pb-24">
      <Header bankroll={props.bankroll} sessionProfit={props.sessionProfit} />

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <AiPredictorCard prediction={props.prediction} round={props.history.length + 1} />
          <ChipSelector 
            selectedChip={props.selectedChip}
            customChip={props.customChip}
            setSelectedChip={props.setSelectedChip}
            setCustomChip={props.setCustomChip}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <BettingBoard bets={props.bets} onPlaceBet={props.handlePlaceBet} />
          <ActionBar 
            currentTotalBet={props.currentTotalBet}
            onClearBets={props.clearBets}
            onShowResultModal={() => props.setShowResultModal(true)}
          />
          <HistoryTable history={props.history} />
        </div>
      </main>

      <ResultModal
        isOpen={props.showResultModal}
        onClose={() => props.setShowResultModal(false)}
        onSubmit={props.handleResultSubmit}
        isSubmitting={props.isSubmitting}
      />
    </div>
  );
}
