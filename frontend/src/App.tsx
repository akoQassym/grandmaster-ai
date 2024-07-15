import { useEffect, useState } from 'react';
import styled from 'styled-components';
import './App.css';

import { GameList, GameDetails } from './components';
import { Game } from './types';

const App: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    console.log("selected:", selectedGame);
  }, [selectedGame])

  const selectGame = (game: Game) => {
    setSelectedGame(game);
  }

  return (
    <AppWrapper>
      <ContentWrapper>
        <H1>Grandmaster AI</H1>
        <H3>Your ultimate chess coach</H3>
        {selectedGame ? (
          <GameDetails
            id = {selectedGame.id}
            date = {selectedGame.date}
            userId = {selectedGame.userId}
            opponentId = {selectedGame.opponentId}
            opponentName = {selectedGame.opponentName}
            opponentRating = {selectedGame.opponentRating}
            color = {selectedGame.color}
            status = {selectedGame.status}
            winner = {selectedGame.winner}
            pgn = {selectedGame.pgn}
          />
        ) : (
          <GameList onSelectGame={(game: Game) => selectGame(game)} />
        )}
      </ContentWrapper>
    </AppWrapper>
  );
};

export default App;

const AppWrapper = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`

const ContentWrapper = styled.div`
  display: block;
  max-width: 100%;
  padding: 10px;

  @media (min-width: 1000px) {
    max-width: 1000px;
    margin: 0 auto;
  }
`

const H1 = styled.h1`
  font-weight: ${({ theme }) => theme.fontWeightUltrabold};
  color: ${({ theme }) => theme.highlightColor};
`

const H3 = styled.h3`
  font-weight: ${({ theme }) => theme.fontWeightBold};
`