import chess
import chess.pgn
from stockfish import Stockfish
from fastapi import HTTPException
from io import StringIO

# Set the path to your Stockfish binary
STOCKFISH_PATH = "/usr/games/stockfish"

def classify_move(evaluation_before, evaluation_after, user_color, user_move, best_move):
    eval_diff = evaluation_after - evaluation_before

    # Check for missed win (mate in best move)
    # A positive value indicates a checkmate in that many moves for the player to move, 
    # while a negative value would indicate a forced checkmate by the opponent.
    if user_move != best_move['Move']:
        if best_move['Mate'] is not None and best_move['Mate'] > 0:
            return "Missed Win"
    
    # Flip the evaluation difference if the user is black
    if user_color == chess.BLACK:
        eval_diff = -eval_diff

    if eval_diff >= 300:
        return "Brilliant"
    elif 100 <= eval_diff < 300:
        return "Excellent"
    elif 0 <= eval_diff < 100:
        return "Good"
    elif -50 < eval_diff < 0:
        return "Inaccuracy"
    elif -300 < eval_diff <= -50:
        return "Mistake"
    elif eval_diff <= -300:
        return "Blunder"

def analyze_game(username: str, pgn: str):
    stockfish = Stockfish(STOCKFISH_PATH)
    
    # Parse the PGN string into a game object
    pgn_io = StringIO(pgn)
    game = chess.pgn.read_game(pgn_io)
    if game is None:
        raise HTTPException(status_code=400, detail="Invalid PGN string")

    board = game.board()
    analysis_results = []

    # Determine if the user is playing as white or black
    user_color = None
    for header in game.headers:
        if header == "White" and game.headers[header].lower() == username.lower():
            user_color = chess.WHITE
        elif header == "Black" and game.headers[header].lower() == username.lower():
            user_color = chess.BLACK

    if user_color is None:
        raise HTTPException(status_code=400, detail="User not found in the game headers")

    # Analyze only the user's moves
    for move in game.mainline_moves():
        if board.turn == user_color:
            fen_before = board.fen()
            stockfish.set_fen_position(fen_before)
            evaluation_before = stockfish.get_evaluation()["value"]
            pv_before = stockfish.get_top_moves(3)

            board.push(move)
            fen_after = board.fen()
            stockfish.set_fen_position(fen_after)
            evaluation_after = stockfish.get_evaluation()["value"]
            best_move = stockfish.get_best_move()
            pv_after = stockfish.get_top_moves(3)

            user_move_uci = move.uci()
            classification = classify_move(evaluation_before, evaluation_after, user_color, user_move_uci, pv_before[0])

            analysis_results.append({
                "uci_move": user_move_uci,  # Move made by the user
                "fen_before": fen_before,  # FEN string before the move
                "fen_after": fen_after,  # FEN string after the move
                "evaluation_before": evaluation_before,
                "evaluation_after": evaluation_after,
                "classification": classification,  # Classification of the move
                "best_move": best_move,  # Best move that should have been played
                "pv_before": pv_before,  # Principal Variation before the move
                "pv_after": pv_after  # Principal Variation after the move
            })
        else:
            board.push(move)

    return analysis_results