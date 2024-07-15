import { useState, useEffect } from 'react';
import axios from 'axios';
import ChessBoard from './ChessBoard';
import { Key } from "chessground/src/types";
import styled from 'styled-components';
import { theme } from '../theme';
import Button from './Button';

interface GameDetailsProps {
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

interface PV {
  Move: string;
  Centipawn: number;
  Mate: boolean | null;
}

interface Move {
  uci_move: string;
  best_move: string;
  classification: "Brilliant" | "Excellent" | "Good" | "Inaccuracy" | "Mistake" | "Blunder" | "Missed Win";
  evaluation_before: number;
  evaluation_after: number;
  fen_before: string;
  fen_after: string;
  pv_after: Array<PV>;
  pv_before: Array<PV>;
}

const classificationToColorMatcher: Record<Move['classification'], {color: string, bgColor: string}> = {
  "Brilliant": {
    color: theme.classificationColors.brilliant,
    bgColor: theme.classificationBgColors.brilliant
  },
  "Excellent": {
    color: theme.classificationColors.excellent,
    bgColor: theme.classificationBgColors.excellent
  },
  "Good": {
    color: theme.classificationColors.good,
    bgColor: theme.classificationBgColors.good
  },
  "Inaccuracy": {
    color: theme.classificationColors.inaccuracy,
    bgColor: theme.classificationBgColors.inaccuracy
  },
  "Mistake": {
    color: theme.classificationColors.mistake,
    bgColor: theme.classificationBgColors.mistake
  },
  "Blunder": {
    color: theme.classificationColors.blunder,
    bgColor: theme.classificationBgColors.blunder
  },
  "Missed Win": {
    color: theme.classificationColors.missedWin,
    bgColor: theme.classificationBgColors.missedWin
  },
}

const GameDetails: React.FC<GameDetailsProps> = ({ 
  id,
  date,
  userId,
  opponentId,
  opponentName,
  opponentRating,
  color,
  status,
  winner,
  pgn,
 }) => {
  const [gameData, setGameData] = useState<Array<Move>>([]);
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [explanations, setExplanations] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchGameDetails = async () => {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/analyze`, { pgn: pgn, username: userId });
      console.log(response.data);
      setSelectedMove(response.data[0]);
      setGameData(response.data);
    };

    fetchGameDetails();
  }, [pgn, userId]);

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
    <FlexWrapper>
      <ChessBoardWrapper>
        {selectedMove && 
          <ChessBoard 
            width={500} 
            height={500} 
            fen={selectedMove.fen_after} 
            lastMove={uciToSquares(selectedMove.uci_move) as Key[]}
            orientation={color}
          />
        }
      </ChessBoardWrapper>
      <div>
        <MoveListContainer>
          {gameData.map((move: Move, index: number) => (
            <MoveContainer 
              $classification={move.classification} 
              $selected={(selectedMove && move === selectedMove) ? true : false}
              onClick={() => setSelectedMove(move)}
              key={index}
            >
              <MoveIndex>{index + 1}.</MoveIndex>
              <span>{move.uci_move}</span>
            </MoveContainer>
          ))}
        </MoveListContainer>
        {selectedMove && (
          <div>
            <MoveLabel>{selectedMove.uci_move}</MoveLabel>
            <MoveLabel>{selectedMove.evaluation_before} -{'>'} {selectedMove.evaluation_after}</MoveLabel>
            <ClassificationLabel $classification={selectedMove.classification}>{selectedMove.classification}</ClassificationLabel>
            <MoveLabel>{selectedMove.best_move}</MoveLabel>
            <Button mode="secondary" onClick={() => handleExplainMove(selectedMove)}>Explain</Button>
            {explanations[selectedMove.uci_move] && <p>{explanations[selectedMove.uci_move]}</p>}
          </div>
        )}
      </div>
    </FlexWrapper>
  );
};

export default GameDetails;

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const ChessBoardWrapper = styled.div`
  width: 500px;
  height: 500px;
  margin-right: 15px;
`

const MoveListContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`

const MoveContainer = styled.div<{ $classification: Move['classification'], $selected: boolean }>`
  background-color: ${props => classificationToColorMatcher[props.$classification].bgColor};
  color: ${props => classificationToColorMatcher[props.$classification].color};
  padding: 5px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 2px;
  cursor: pointer;
  box-shadow: ${props => props.$selected ? 'inset 0px 0px 0px 2px white' : 'none'};
`

const MoveIndex = styled.span`
  margin-right: 5px;
`

const MoveLabel = styled.p`
  
`

const ClassificationLabel = styled(MoveLabel)<{ $classification: Move['classification'] }>`
  color: ${props => classificationToColorMatcher[props.$classification].color};
`