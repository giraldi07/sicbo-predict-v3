import { TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Prediction } from "@/lib/types";

type AiPredictorCardProps = {
  prediction: Prediction;
  round: number;
};

export default function AiPredictorCard({ prediction, round }: AiPredictorCardProps) {
  const confidenceColor = prediction.confidence > 75 ? "bg-green-500" : prediction.confidence > 50 ? "bg-yellow-500" : "bg-red-500";
  
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/20 overflow-hidden shadow-lg shadow-primary/10 relative">
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/70 to-blue-600/50"></div>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
            <CardTitle className="font-headline text-lg flex items-center gap-2 text-primary">
                <TrendingUp className="w-5 h-5" /> AI Prediksi
            </CardTitle>
            <span className="text-xs font-semibold bg-background/50 px-2 py-1 rounded text-muted-foreground border">
                Round #{round}
            </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-background rounded-xl p-4 border space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Ukuran (Big/Small)</span>
            <span className={`font-black font-headline text-xl px-3 py-1 rounded ${prediction.bigSmall === 'BIG' ? 'bg-red-900/30 text-red-400 border border-red-800/50' : prediction.bigSmall === 'SMALL' ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' : 'bg-muted'}`}>
              {prediction.bigSmall}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Ganjil/Genap</span>
            <span className="font-bold text-lg font-headline text-foreground">
              {prediction.oddEven}
            </span>
          </div>
          <div className="pt-3 border-t flex justify-between items-center">
            <span className="text-muted-foreground text-sm flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-yellow-600" /> Peluang Leopard
            </span>
            <span className={`font-semibold text-sm ${
              prediction.leopardChance.includes('Tinggi') ? 'text-red-500 animate-pulse' : 
              prediction.leopardChance.includes('Sedang') ? 'text-yellow-500' : 'text-green-500'
            }`}>
              {prediction.leopardChance}
            </span>
          </div>
        </div>

        <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Tingkat Keyakinan</span>
                <span className="font-bold font-code">{prediction.confidence.toFixed(0)}%</span>
            </div>
            <Progress value={prediction.confidence} indicatorClassName={confidenceColor} />
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="explanation" className="border-b-0">
            <AccordionTrigger className="text-sm hover:no-underline justify-center py-2 bg-accent/50 rounded-md px-4">
                <Lightbulb className="w-4 h-4 mr-2"/>
                Lihat Alasan Prediksi AI
            </AccordionTrigger>
            <AccordionContent className="pt-4 text-sm text-muted-foreground bg-background/50 p-4 rounded-b-md border border-t-0">
              {prediction.explanation}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
