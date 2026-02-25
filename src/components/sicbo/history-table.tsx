import type { HistoryItem } from "@/lib/types";
import { formatIDR } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from "lucide-react";
import { Separator } from "../ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import Dice from "./dice";

type HistoryTableProps = {
  history: HistoryItem[];
};

export default function HistoryTable({ history }: HistoryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2 text-foreground">
          <History className="w-5 h-5 text-blue-400" /> Riwayat Putaran
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="px-4">Rnd</TableHead>
                <TableHead className="px-4 text-center">Dadu</TableHead>
                <TableHead className="px-4 text-center">Sum</TableHead>
                <TableHead className="px-4 text-center">Hasil</TableHead>
                <TableHead className="px-4 text-right">Profit/Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence initial={false}>
                {history.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                          Belum ada riwayat permainan.
                      </TableCell>
                  </TableRow>
                ) : (
                  history.slice().reverse().map((h) => (
                      <motion.tr 
                        key={h.id} 
                        layout
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-accent/50"
                      >
                        <TableCell className="px-4 font-code text-muted-foreground">#{h.round}</TableCell>
                        <TableCell className="px-4">
                            <div className="flex justify-center items-center gap-1 font-bold font-code">
                              <Dice value={h.d1} className="w-6 h-6" />
                              <Dice value={h.d2} className="w-6 h-6" />
                              <Dice value={h.d3} className="w-6 h-6" />
                            </div>
                        </TableCell>
                        <TableCell className="px-4 text-center font-bold font-code">{h.sum}</TableCell>
                        <TableCell className="px-4 text-center">
                            <div className="flex flex-wrap gap-1 justify-center">
                            {h.isL ? <span className="bg-purple-900 text-purple-300 text-[10px] px-2 py-0.5 rounded font-bold">LEOPARD</span> 
                            : <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${h.isB ? 'bg-red-900 text-red-300' : 'bg-blue-900 text-blue-300'}`}>{h.isB ? 'BIG' : 'SMALL'}</span>}
                            <span className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded font-bold">{h.isO ? 'ODD' : 'EVEN'}</span>
                            </div>
                        </TableCell>
                        <TableCell className="px-4 text-right font-code text-xs">
                            {Object.values(h.bets).reduce((a, b) => a + b, 0) === 0 ? (
                                <span className="text-muted-foreground">-</span>
                            ) : (
                                <div className="flex flex-col items-end gap-1">
                                    {Object.entries(h.profitDetail).map(([type, profit]) => {
                                        if (h.bets[type as keyof typeof h.bets] > 0) {
                                            return (
                                                <div key={type} className={`flex justify-between w-full max-w-[120px] ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    <span className="font-semibold uppercase">{type}:</span>
                                                    <span>{profit >= 0 ? '+' : ''}{formatIDR(profit)}</span>
                                                </div>
                                            )
                                        }
                                        return null;
                                    })}
                                <Separator className="my-1 bg-border/50 max-w-[120px]"/>
                                    <div className={`flex justify-between w-full max-w-[120px] font-bold ${h.profit > 0 ? 'text-green-500' : h.profit < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                                        <span>TOTAL:</span>
                                        <span>{h.profit > 0 ? '+' : ''}{formatIDR(h.profit)}</span>
                                    </div>
                                </div>
                            )}
                        </TableCell>
                      </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
