export interface Game {
    id: string;
    date: string;
    userId: string;
    opponentId: string | null;
    opponentName: string;
    opponentRating: number, 
    color: "white" | "black";
    status: string;
    winner: string;
    pgn: string;
    analysis?: Move[] | undefined;
    explanations?: { [key: string]: string } | undefined;
  }
  
  export interface Move {
    uci_move: string;
    best_move: string;
    classification: "Brilliant" | "Excellent" | "Good" | "Inaccuracy" | "Mistake" | "Blunder" | "Missed Win" | "Neutral";
    evaluation_before: number;
    evaluation_after: number;
    fen_before: string;
    fen_after: string;
    pv_after: Array<PV>;
    pv_before: Array<PV>;
  }

  export interface PV {
    Move: string;
    Centipawn: number;
    Mate: boolean | null;
  }