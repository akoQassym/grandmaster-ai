import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import Button from './Button';

import { Game } from '../types';
import { useGameContext } from '../GameContext';

const GameList: React.FC = () => {
  const navigate = useNavigate();
  const { games, setGames } = useGameContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [lichessId, setLichessId] = useState('');
  const [groupedGames, setGroupedGames] = useState<{ [key: string]: Game[] }>({});

  const fetchGames = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/lichess/${lichessId}`);
      const games = response.data.map((game: any) => {
        const isUserWhite = game.players.white.user?.id === lichessId;
        const opponent = isUserWhite ? game.players.black : game.players.white;

        return {
          id: game.id,
          date: new Date(game.createdAt).toLocaleString(),
          userId: lichessId,
          opponentId: opponent.user ? opponent.user.id : null,
          opponentName: opponent.user ? opponent.user.name : `AI Level ${opponent.aiLevel}`,
          opponentRating: opponent.user ? opponent.rating : opponent.aiLevel,
          color: isUserWhite ? 'white' : 'black',
          winner: game.winner,
          status: game.status,
          pgn: game.pgn,
        };
      });
      setGames(games);
      setGroupedGames(groupGamesByDate(games));
    } catch (error) {
      console.error("Error fetching games:", error);
    }
    setLoading(false);
  };

  const groupGamesByDate = (games: Game[]) => {
    return games.reduce((groupedGames, game) => {
      const date = new Date(game.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      if (!groupedGames[date]) {
        groupedGames[date] = [];
      }
      
      groupedGames[date].push(game);
      return groupedGames;
    }, {} as { [key: string]: Game[] });
  };

  const handleSelectGame = (game: Game) => {
    navigate(`/game/${game.id}`, { state: { game } });
  };

  useEffect(() => {
    if (games.length > 0) {
      setGroupedGames(groupGamesByDate(games));
    }
  }, [games]);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your Lichess ID"
        value={lichessId}
        onChange={(e) => setLichessId(e.target.value)}
      />
      <Button mode='secondary' onClick={fetchGames}>Fetch Games</Button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <GameGroupWrapper>
          {Object.keys(groupedGames).map((date) => (
            <div key={date}>
              <h2>{date}</h2>
              <GameListWrapper>
                {groupedGames[date].map((game) => (
                  <GameContainer key={game.id}>
                    <GameStatus $won={game.color === game.winner}>{game.color === game.winner ? 'Win' : 'Lose'}</GameStatus>
                    <p>You ({game.color}) vs {game.opponentName} ({game.opponentRating})</p>
                    <p>Game status: {game.status} </p>
                    <Button mode='secondary' onClick={() => handleSelectGame(game)}>Analyze</Button>
                  </GameContainer>
                ))}
              </GameListWrapper>
            </div>
          ))}
        </GameGroupWrapper>
      )}
      
    </div>
  );
};

export default GameList;

const GameGroupWrapper = styled.div`
  padding: 25px 0;
`

const GameListWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const GameContainer = styled.div`
  background: ${({ theme }) => theme.secondaryColor};
  border-radius: 5px;
  margin-right: 15px;
  margin-bottom: 15px;
  padding: 15px 10px;
  box-sizing: border-box;
  width: 230px;
`

const GameStatus = styled.p<{ $won?: boolean; }>`
  font-weight: ${({ theme }) => theme.fontWeightBold};
  color: ${props => props.$won ? props.theme.green : props.theme.red};
`