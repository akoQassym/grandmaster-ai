import Chessground from '@react-chess/chessground';
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import { Key } from "chessground/src/types";
import styled from 'styled-components';

interface ChessBoardProps {
  fen: string;
  lastMove: Key[];
  width: number;
  height: number;
  orientation: "white" | "black";
}

const ChessBoard: React.FC<ChessBoardProps> = ({ fen, lastMove, width = 400, height = 400, orientation = 'white' }) => {
  return (
    <ChessgroundWrapper $height={height} $width={width}>
      <Chessground
        width={width}
        height={height}
        contained={true}
        config={{
          fen: fen,
          orientation: orientation,
          movable: {
            free: false,
            color: 'both',
          },
          lastMove: lastMove,
          highlight: {
            lastMove: true
          },
          selectable: {
            enabled: false
          }
        }}
      />
    </ChessgroundWrapper>
  );
};

export default ChessBoard;

const ChessgroundWrapper = styled.div<{ $width: number, $height: number }>`
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
`
