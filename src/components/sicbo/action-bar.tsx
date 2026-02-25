import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatIDR } from "@/lib/utils";
import { Trash2, PlusCircle } from "lucide-react";

type ActionBarProps = {
  currentTotalBet: number;
  onClearBets: () => void;
  onShowResultModal: () => void;
};

export default function ActionBar({ currentTotalBet, onClearBets, onShowResultModal }: ActionBarProps) {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button 
            variant="destructive"
            onClick={onClearBets}
            disabled={currentTotalBet === 0}
            className="flex-1 sm:flex-none"
          >
            <Trash2 className="w-4 h-4" /> Batal Bet
          </Button>
          <div className="text-sm text-muted-foreground">
            Total Bet: <span className="font-code text-foreground font-bold">{formatIDR(currentTotalBet)}</span>
          </div>
        </div>
        
        <Button 
          onClick={onShowResultModal}
          disabled={currentTotalBet === 0}
          className="w-full sm:w-auto text-base font-bold shadow-lg shadow-primary/20"
          size="lg"
        >
          Input Hasil Dadu <PlusCircle className="w-5 h-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
