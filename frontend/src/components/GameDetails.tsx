import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import ChessBoard from './ChessBoard';
import { Key } from "chessground/src/types";
import styled from 'styled-components';
import { theme } from '../theme';
import Button from './Button';
import { useParams, useNavigate } from 'react-router-dom';
import { Game, Move } from '../types';
import { useGameContext } from '../GameContext';

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
  "Neutral": {
    color: theme.classificationColors.neutral,
    bgColor: theme.classificationBgColors.neutral
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

const SETUP_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const GameDetails: React.FC = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { games, setGames } = useGameContext();
  const game = games.find((g) => g.id === gameId);

  const [selectedMove, setSelectedMove] = useState<Move | null>(game?.analysis ? game?.analysis[0] : null);
  const [gptLoading, setGptLoading] = useState<boolean>(false);
  const [boardSize, setBoardSize] = useState<number>(window.innerWidth < 520 ? 300 : 500);

  useEffect(() => {
    const handleResize = () => {
      setBoardSize(window.innerWidth < 520 ? 300 : 500);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchGameDetails = async () => {
      if (game && !game.analysis) {
        console.log('Fetching game details');
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/analyze`, { pgn: game.pgn, username: game.userId });
        setSelectedMove(response.data[0]);
        updateGameInContext(gameId!, response.data, game.explanations || {});
      }
    };

    fetchGameDetails();
  }, [game]);

  const updateGameInContext = (id: string, analysis: Move[] | undefined, explanations: { [key: string]: string } | undefined) => {
    const updatedGames = games.map(g => g.id === id ? { ...g, analysis, explanations } : g);
    setGames(updatedGames);
  };

  const handleExplainMove = async (move: Move) => {
    setGptLoading(true);
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/explain`, { analysis: move });
    const updatedExplanations = { ...game?.explanations, [move.uci_move]: response.data.explanation };
    updateGameInContext(gameId!, game?.analysis, updatedExplanations);
    setGptLoading(false);
  };

  const uciToSquares = (uciMove: string): string[] => {
    return [uciMove.slice(0, 2), uciMove.slice(2, 4)];
  };

  if (!game) return <div>Game not found</div>;

  if (!game.analysis || game.analysis.length === 0) return (
    <GameDetailsWrapper>
      <Button mode="secondary" onClick={() => navigate(-1)}>Back</Button>
      <p>
        <GameStatus $won={game.color === game.winner}>{game.color === game.winner ? 'Win' : 'Lose'}</GameStatus>
        {' '}vs {game.opponentId} ({game.opponentRating})
      </p>
      <FlexWrapper>
        <ChessBoardWrapper>
            <ChessBoard 
              width={boardSize} 
              height={boardSize} 
              fen={SETUP_FEN}
              orientation={game.color}
            />
        </ChessBoardWrapper>
        <div>
          <h4>Loading...</h4>
          <p>Game analysis is loading, this will take max 10 seconds ={')'}</p>
        </div>
      </FlexWrapper>
    </GameDetailsWrapper>
  );

  return (
    <GameDetailsWrapper>
      <Button mode="secondary" onClick={() => navigate(-1)}>Back to my Games List</Button>
      <p>
        <GameStatus $won={game.color === game.winner}>{game.color === game.winner ? 'Win' : 'Lose'}</GameStatus>
        {' '}vs {game.opponentId} ({game.opponentRating})
      </p>
      <FlexWrapper>
        <ChessBoardWrapper>
          {selectedMove && 
            <ChessBoard 
              width={boardSize} 
              height={boardSize} 
              fen={selectedMove.fen_after} 
              lastMove={uciToSquares(selectedMove.uci_move) as Key[]}
              orientation={game.color}
            />
          }
        </ChessBoardWrapper>
        <div>
          <MoveListContainer>
            {game.analysis.map((move: Move, index: number) => (
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
              <MoveLabel>Your move: {selectedMove.uci_move}</MoveLabel>
              <ClassificationLabel $classification={selectedMove.classification}>{selectedMove.classification} ({selectedMove.evaluation_after - selectedMove.evaluation_before > 0 && "+"}{(selectedMove.evaluation_after - selectedMove.evaluation_before).toFixed(2)})</ClassificationLabel>
              <MoveLabel>Best move: {selectedMove.best_move}</MoveLabel>
              <Button mode="secondary" onClick={() => handleExplainMove(selectedMove)}>Explain</Button>
            </div>
          )}
        </div>
      </FlexWrapper>
      {gptLoading ? (
        <div>
          <h4>Loading...</h4>
          <p>Grandmaster AI is thinking...</p>
        </div>
      ) : selectedMove && game.explanations && game.explanations[selectedMove.uci_move] && (
        <div>
          <h2>A note from your teacher:</h2>
          <h4>Move: {selectedMove.uci_move} ({selectedMove.classification})</h4>
          <ReactMarkdown>{game.explanations[selectedMove.uci_move]}</ReactMarkdown>
        </div>
      )}
    </GameDetailsWrapper>
  );
};

export default GameDetails;

const GameDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 999px) {
    flex-direction: column;
  }
`

const ChessBoardWrapper = styled.div`
  max-width: 500px;
  max-height: 500px;
  margin-right: 15px;
`

const MoveListContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 999px) {
    margin-top: 20px;
  }
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

const GameStatus = styled.span<{ $won?: boolean; }>`
  font-weight: ${({ theme }) => theme.fontWeightBold};
  color: ${props => props.$won ? props.theme.green : props.theme.red};
`