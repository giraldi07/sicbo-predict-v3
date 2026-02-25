import type { Bets, BetType } from "@/lib/types";
import { formatIDR } from "@/lib/utils";
import { Dices } from "lucide-react";
import { cn } from "@/lib/utils";

type BettingBoardProps = {
  bets: Bets;
  onPlaceBet: (type: BetType) => void;
};

export default function BettingBoard({ bets, onPlaceBet }: BettingBoardProps) {

  const BetButton = ({ type, label, description, className, children }: { type: BetType, label: string, description: string, className?: string, children?: React.ReactNode }) => (
    <button 
      onClick={() => onPlaceBet(type)}
      className={cn("relative border-2 rounded-2xl flex flex-col justify-center items-center group transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-ring", className)}
    >
      {children}
      {bets[type] > 0 && (
        <div className={cn(
            "absolute bg-yellow-500 text-black font-code font-bold px-2 py-1 rounded-full text-xs md:text-sm shadow-lg border-2 border-yellow-300 animate-pulse",
            (type === 'BIG' || type === 'SMALL') && 'top-2 right-2 md:top-4 md:right-4',
            (type === 'ODD' || type === 'EVEN') && 'bottom-2',
            type === 'LEOPARD' && 'top-2'
            )}>
          {formatIDR(bets[type])}
        </div>
      )}
    </button>
  );

  return (
    <div className="bg-green-900/20 p-4 md:p-6 rounded-3xl border-2 border-green-800/50 relative overflow-hidden shadow-2xl shadow-green-900/20">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.4%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"></div>
      
      <div className="relative z-10 space-y-4">
        <div className="grid grid-cols-2 gap-4 h-32 md:h-40">
          <BetButton type="SMALL" label="SMALL" description="(Total 4-10) 1:1.97" className="bg-gradient-to-br from-blue-800 to-blue-900 border-blue-400 hover:border-white">
            <div className="font-headline text-3xl md:text-5xl font-black text-white tracking-widest group-hover:scale-105 transition-transform">SMALL</div>
            <div className="text-blue-300 text-xs mt-1">(Total 4-10) 1:1.97</div>
          </BetButton>
          
          <BetButton type="BIG" label="BIG" description="(Total 11-17) 1:1.97" className="bg-gradient-to-br from-red-800 to-red-900 border-red-400 hover:border-white">
            <div className="font-headline text-3xl md:text-5xl font-black text-white tracking-widest group-hover:scale-105 transition-transform">BIG</div>
            <div className="text-red-300 text-xs mt-1">(Total 11-17) 1:1.97</div>
          </BetButton>
        </div>

        <div className="grid grid-cols-3 gap-3 h-28 md:h-36">
          <BetButton type="ODD" label="ODD" description="Ganjil (1:1.97)" className="bg-background border-border hover:border-primary">
            <div className="font-headline text-xl md:text-2xl font-bold text-foreground">ODD</div>
            <div className="text-muted-foreground text-[10px] md:text-xs">Ganjil (1:1.97)</div>
          </BetButton>

          <BetButton type="LEOPARD" label="Leopard" description="Kembar 3 (1:29)" className="bg-gradient-to-t from-purple-900 to-purple-800 border-purple-400 hover:border-yellow-400">
            <Dices className="w-6 h-6 text-yellow-400 mb-1" />
            <div className="font-headline text-md md:text-xl font-bold text-yellow-400 uppercase tracking-tighter">Leopard</div>
            <div className="text-purple-300 text-[10px] md:text-xs text-center leading-tight mt-1">Kembar 3<br/>1:29</div>
          </BetButton>

          <BetButton type="EVEN" label="EVEN" description="Genap (1:1.97)" className="bg-background border-border hover:border-primary">
            <div className="font-headline text-xl md:text-2xl font-bold text-foreground">EVEN</div>
            <div className="text-muted-foreground text-[10px] md:text-xs">Genap (1:1.97)</div>
          </BetButton>
        </div>
      </div>
    </div>
  );
}
