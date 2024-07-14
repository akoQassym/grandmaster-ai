import { useState } from 'react';
import axios from 'axios';

interface Game {
  id: string;
  date: string;
  opponent: string;
  opponentRating: number, 
  color: string;
  status: string;
  winner: string;
  pgn: string;
}

interface GameListProps {
  onSelectGame: (pgn: string, username: string) => void;
}

const GameList: React.FC<GameListProps> = ({ onSelectGame }) => {
  const [lichessId, setLichessId] = useState('');
  const [games, setGames] = useState<Game[]>([]);

  const fetchGames = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/lichess/${lichessId}`);
      const games = response.data.map((game: any) => {
        const isUserWhite = game.players.white.user?.id === lichessId;
        const opponent = isUserWhite
          ? game.players.black
          : game.players.white;
  
        return {
          id: game.id,
          date: new Date(game.createdAt).toLocaleString(),
          opponent: opponent.user ? opponent.name : `AI Level ${opponent.aiLevel}`,
          opponentRating: opponent.user ? opponent.rating : opponent.aiLevel,
          color: isUserWhite ? 'white' : 'black',
          winner: game.winner,
          status: game.status,
          pgn: game.pgn,
        };
      });
      setGames(games);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your Lichess ID"
        value={lichessId}
        onChange={(e) => setLichessId(e.target.value)}
      />
      <button onClick={fetchGames}>Fetch Games</button>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <p>{game.date} </p>
            <p>Opponent: {game.opponent} ({game.opponentRating})</p>
            <p>You played: {game.color} </p>
            <p>Winner: {game.winner} </p>
            <p>Game status:{game.status} </p>
            <p>Game PGN:{game.pgn} </p>
            <button onClick={() => onSelectGame(game.pgn, lichessId)}>Analyze</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameList;
