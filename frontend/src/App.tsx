import { useEffect, useState } from 'react';
import { GameList, GameDetails } from './components';
import './App.css';

const App: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<{ pgn: string; username: string } | null>(null);
  useEffect(() => {
    console.log("selected:", selectedGame);
  }, [selectedGame])

  return (
    <div className="App">
      {selectedGame ? (
        <GameDetails pgn={selectedGame.pgn} username={selectedGame.username} />
      ) : (
        <GameList onSelectGame={(pgn, username) => setSelectedGame({ pgn, username })} />
      )}
    </div>
  );
};

export default App;
