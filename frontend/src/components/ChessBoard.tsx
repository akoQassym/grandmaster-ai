import Chessground from '@react-chess/chessground';
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import { Key } from "chessground/src/types";

interface ChessBoardProps {
  fen: string;
  lastMove: Key[];
}

const ChessBoard: React.FC<ChessBoardProps> = ({ fen, lastMove }) => {
  return (
    <div>
      <Chessground
        width={400}
        height={400}
        contained={true}
        config={{
          fen: fen,
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
    </div>
  );
};

export default ChessBoard;
