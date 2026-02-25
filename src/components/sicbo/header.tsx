import { Dices } from "lucide-react";
import { formatIDR } from "@/lib/utils";

type HeaderProps = {
  bankroll: number;
  sessionProfit: number;
};

export default function Header({ bankroll, sessionProfit }: HeaderProps) {
  return (
    <header className="bg-card/50 border-b border-border sticky top-0 z-20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Dices className="w-6 h-6 text-primary" />
          <span className="font-headline font-bold text-lg hidden sm:block text-foreground">SicBo Pro</span>
        </div>
        <div className="flex items-center gap-4 md:gap-8">
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Total Bankroll</div>
            <div className="font-code font-bold text-primary text-lg">{formatIDR(bankroll)}</div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-xs text-muted-foreground">Profit Sesi</div>
            <div className={`font-code font-bold text-sm ${sessionProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {sessionProfit > 0 ? '+' : ''}{formatIDR(sessionProfit)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
