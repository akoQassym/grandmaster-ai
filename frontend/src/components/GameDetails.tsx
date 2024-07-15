import { useState, useEffect } from 'react';
import axios from 'axios';
import ChessBoard from './ChessBoard';
import { Key } from "chessground/src/types";

interface GameDetailsProps {
  pgn: string;
  username: string;
}

interface PV {
  Move: string;
  Centipawn: number;
  Mate: boolean | null;
}

interface Move {
  uci_move: string;
  best_move: string;
  classification: string;
  evaluation_before: number;
  evaluation_after: number;
  fen_before: string;
  fen_after: string;
  pv_after: Array<PV>;
  pv_before: Array<PV>;
}

const GameDetails: React.FC<GameDetailsProps> = ({ pgn, username }) => {
  const [gameData, setGameData] = useState<Array<Move>>([]);
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [explanations, setExplanations] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchGameDetails = async () => {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/analyze`, { pgn, username });
      console.log(response.data);
      setSelectedMove(response.data[0]);
      setGameData(response.data);
    };

    fetchGameDetails();
  }, [pgn, username]);

  const handleExplainMove = async (move: Move) => {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/explain`, { analysis: move });
    console.log(response.data);
    setExplanations((prev) => ({ ...prev, [move.uci_move]: response.data.explanation }));
  };

  const uciToSquares = (uciMove: string): string[] => {
    return [uciMove.slice(0, 2), uciMove.slice(2, 4)];
  };

  if (gameData.length === 0) return <div>Loading...</div>;

  return (
    <div>
      {selectedMove && <ChessBoard fen={selectedMove.fen_after} lastMove={uciToSquares(selectedMove.uci_move) as Key[]}/>}
      <ul>
        {gameData.map((move: any, index: number) => (
          <li key={index}>
            <p>Move: {move.uci_move}</p>
            <p>Evaluation Change: {move.evaluation_before} -{'>'} {move.evaluation_after}</p>
            <p>Best Move: {move.best_move}</p>
            <p>Classification: {move.classification}</p>
            <button onClick={() => setSelectedMove(move)}>Select</button>
            <button onClick={() => handleExplainMove(move)}>Explain</button>
            {explanations[move.uci_move] && <p>{explanations[move.uci_move]}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameDetails;
