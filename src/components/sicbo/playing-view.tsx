import type { useSicboGame } from "@/hooks/use-sicbo-game";
import Header from "./header";
import AiPredictorCard from "./ai-predictor-card";
import ChipSelector from "./chip-selector";
import BettingBoard from "./betting-board";
import ActionBar from "./action-bar";
import HistoryTable from "./history-table";
import ResultModal from "./result-modal";
import { motion } from "framer-motion";

type PlayingViewProps = ReturnType<typeof useSicboGame>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function PlayingView(props: PlayingViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background pb-24"
    >
      <Header bankroll={props.bankroll} sessionProfit={props.sessionProfit} />

      <main 
        className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-1 space-y-6"
        >
          <motion.div variants={itemVariants}>
            <AiPredictorCard prediction={props.prediction} round={props.history.length + 1} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ChipSelector 
              selectedChip={props.selectedChip}
              customChip={props.customChip}
              setSelectedChip={props.setSelectedChip}
              setCustomChip={props.setCustomChip}
            />
          </motion.div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 space-y-6"
        >
          <motion.div variants={itemVariants}>
            <BettingBoard bets={props.bets} onPlaceBet={props.handlePlaceBet} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ActionBar 
              currentTotalBet={props.currentTotalBet}
              onClearBets={props.clearBets}
              onShowResultModal={() => props.setShowResultModal(true)}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <HistoryTable history={props.history} />
          </motion.div>
        </motion.div>
      </main>

      <ResultModal
        isOpen={props.showResultModal}
        onClose={() => props.setShowResultModal(false)}
        onSubmit={props.handleResultSubmit}
        isSubmitting={props.isSubmitting}
      />
    </motion.div>
  );
}
