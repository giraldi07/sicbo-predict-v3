import { cn } from "@/lib/utils";
import type { DiceValue } from "@/lib/types";

type DiceProps = {
  value: DiceValue;
  className?: string;
};

const Dot = () => <div className="w-1/4 h-1/4 rounded-full bg-current" />;

const DiceFace = ({ value }: { value: DiceValue }) => {
  const baseClasses = "w-full h-full rounded-md p-2 flex items-center justify-center gap-1";
  switch (value) {
    case 1:
      return <div className={cn(baseClasses)}><Dot /></div>;
    case 2:
      return <div className={cn(baseClasses, "justify-between")}><Dot className="self-start" /><Dot className="self-end" /></div>;
    case 3:
      return <div className={cn(baseClasses, "justify-between")}><Dot className="self-start" /><Dot className="self-center" /><Dot className="self-end" /></div>;
    case 4:
      return <div className={cn(baseClasses, "flex-wrap gap-y-1/2 justify-around")}><div className="w-full flex justify-between"><Dot /><Dot /></div><div className="w-full flex justify-between"><Dot /><Dot /></div></div>
    case 5:
      return <div className={cn(baseClasses, "flex-wrap justify-around")}><div className="w-full flex justify-between"><Dot /><Dot /></div><div className="w-full flex justify-center"><Dot /></div><div className="w-full flex justify-between"><Dot /><Dot /></div></div>
    case 6:
      return <div className={cn(baseClasses, "flex-wrap justify-around")}><div className="w-full flex justify-between"><Dot /><Dot /></div><div className="w-full flex justify-between"><Dot /><Dot /></div><div className="w-full flex justify-between"><Dot /><Dot /></div></div>
    default:
      return <div className={cn(baseClasses, "text-2xl font-bold")}>?</div>;
  }
};


export default function Dice({ value, className }: DiceProps) {
  return (
    <div className={cn("bg-card text-card-foreground border rounded-lg p-1", className)}>
        <DiceFace value={value} />
    </div>
  );
}
