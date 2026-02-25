import type { HistoryItem } from "@/lib/types";
import { formatIDR } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History } from "lucide-react";

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
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead className="px-4">Rnd</TableHead>
                <TableHead className="px-4 text-center">Dadu</TableHead>
                <TableHead className="px-4 text-center">Sum</TableHead>
                <TableHead className="px-4 text-center">Hasil</TableHead>
                <TableHead className="px-4 text-right">Profit/Loss</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.slice().reverse().map((h) => (
                <TableRow key={h.id} className="hover:bg-accent/50">
                  <TableCell className="px-4 font-code text-muted-foreground">#{h.round}</TableCell>
                  <TableCell className="px-4">
                    <div className="flex justify-center items-center gap-1 font-bold font-code">
                      <span className="bg-background w-6 h-6 flex items-center justify-center rounded border">{h.d1}</span>
                      <span className="bg-background w-6 h-6 flex items-center justify-center rounded border">{h.d2}</span>
                      <span className="bg-background w-6 h-6 flex items-center justify-center rounded border">{h.d3}</span>
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
                  <TableCell className={`px-4 text-right font-code font-bold ${h.profit > 0 ? 'text-green-500' : h.profit < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {h.profit > 0 ? '+' : ''}{h.profit === 0 ? '-' : formatIDR(h.profit)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
