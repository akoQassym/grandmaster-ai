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
}