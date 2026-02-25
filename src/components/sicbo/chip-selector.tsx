import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatIDR } from "@/lib/utils";

type ChipSelectorProps = {
  selectedChip: number | 'CUSTOM';
  customChip: number;
  setSelectedChip: (value: number | 'CUSTOM') => void;
  setCustomChip: (value: number) => void;
};

const CHIP_VALUES = [160, 1600, 16000];

export default function ChipSelector({ selectedChip, customChip, setSelectedChip, setCustomChip }: ChipSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pilih Chip Taruhan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 mb-4">
          {CHIP_VALUES.map(val => (
            <Button
              key={val}
              variant="outline"
              onClick={() => setSelectedChip(val)}
              className={cn(
                "py-3 h-auto font-code font-bold border-2 transition-all text-sm",
                selectedChip === val 
                ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                : 'bg-background hover:bg-accent'
              )}
            >
              {formatIDR(val).replace(',00','')}
            </Button>
          ))}
          <Button
            key="custom"
            variant="outline"
            onClick={() => setSelectedChip('CUSTOM')}
            className={cn(
              "py-3 h-auto font-bold border-2 transition-all",
              selectedChip === 'CUSTOM'
              ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
              : 'bg-background hover:bg-accent'
            )}
          >
            CUSTOM
          </Button>
        </div>
        
        {selectedChip === 'CUSTOM' && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-muted-foreground font-bold">Rp</span>
            <Input 
              type="number" 
              value={customChip}
              onChange={(e) => setCustomChip(Number(e.target.value) || 0)}
              className="bg-background border-purple-500/50 font-code focus:border-purple-500"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
