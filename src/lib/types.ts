export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

export type HistoryItem = {
  id: number;
  round: number;
  d1: DiceValue;
  d2: DiceValue;
  d3: DiceValue;
  sum: number;
  isB: boolean;
  isS: boolean;
  isO: boolean;
  isE: boolean;
  isL: boolean;
  bets: Bets;
  profit: number;
};

export type Bets = {
  BIG: number;
  SMALL: number;
  ODD: number;
  EVEN: number;
  LEOPARD: number;
};

export type BetType = keyof Bets;

export type Prediction = {
  bigSmall: 'BIG' | 'SMALL' | '-';
  oddEven: 'ODD' | 'EVEN' | '-';
  leopardChance: 'Rendah' | 'Sedang' | 'Tinggi' | 'Sangat Tinggi (Puncak)';
  confidence: number;
  explanation: string;
};

export type AppState = 'SETUP_BANKROLL' | 'SETUP_PRIMER' | 'PLAYING';
