import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';

import { GameList, GameDetails } from './components';
import { GameContextProvider } from './GameContext';

const App: React.FC = () => {
  return (
    <GameContextProvider>
      <Router>
        <AppWrapper>
          <ContentWrapper>
            <H1>Grandmaster AI</H1>
            <H2>Your ultimate chess coach</H2>
            <p>I am actively looking for feedback. Do not hesitate to DM me on Insta: <a style={{ color: "white" }} href='https://www.instagram.com/ako_q/'>@ako_q</a></p>
            <hr style={{ borderColor: '#202127' }}/>
            <p>UPD: There is a problem on Lichess part due to high volume of requests in parallel. While I am resolving the issue, you can leave your Lichess ID and Email, and I will get back to you immediately when the problem is solved ={')'}.</p>
            <p>Thank you!</p>
            <Routes>
              <Route path="/" element={<GameList />} />
              <Route path="/game/:gameId" element={<GameDetails />} />
            </Routes>
          </ContentWrapper>
        </AppWrapper>
      </Router>
    </GameContextProvider>
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

  @media (min-width: 530px) and (max-width: 999px) {
    max-width: 530px;
    margin: 0 auto;
  }
`

const H1 = styled.h1`
  font-weight: ${({ theme }) => theme.fontWeightUltrabold};
  color: ${({ theme }) => theme.highlightColor};
  margin-bottom: 10px;
`

const H2 = styled.h2`
  font-weight: ${({ theme }) => theme.fontWeightBold};
  margin-top: 5px;
  margin-bottom: 5px;
`