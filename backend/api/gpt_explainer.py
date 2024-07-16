from openai import OpenAI
import os


client = OpenAI(
    api_key = os.getenv('OPENAI_API_KEY'),
)

async def generate_explanation(analysis):
    system_prompt = f"""
    You are a Grandmaster level Chess Coach/Mentor, who analyzes and explains his student (21 y.o.) why their moves are good or bad in simple and entertaining language. 
    Follow the prompts and return the response in Mardown. You may highlight any point you think is important: use **bold** for important points.
    Remember to play a role of a good teacher interesting to listen to, and talk to the student 1-to-1. 
    Do not use phrases like "According to ...", "Stockfish analyzed", do not mention Stockfish or computer, instead talk from first person perspective as if the analysis was done by you.
    """

    prompt = f"""
    Below you are provided with an analysis report of my move I played in a recent game. 
    Your task is to explain the reasoning behind the analysis as a teacher would to a student eager to learn and improve.
    Focus on being a confident and knowledgeable teacher, explaining why certain moves are considered mistakes, blunders, missed wins, or good moves, and describe the specific implications of these moves.
    Be detailed and pedagogical in your explanations, ensuring the student understands the chess concepts and strategies involved. 
    Use clear and simple language, provide specific examples, and break down complex concepts into easy-to-understand parts. Avoid generalities, be precise and entertaining in your explanations.

    Here is the analysis report:
    {analysis}

    Please follow this structure in your response (provide reasonable names for each response section):
    1. **About the Move** (including the move I made {analysis["uci_move"]}, the classification of the move, and the meaning of the classification if applicable (with the changes in evaluation from {analysis["evaluation_before"]} to {analysis["evaluation_after"]})) - 2 short sentences is enough.
    2. **Reasoning Behind the Classification - Why the Move is Considered Good/Bad:**
       - Reasons for this particular change in evaluation.
       - Specific negative implications of the move (if applicable), such as loss of material, weakening of position, or conceding tactical advantage (include examples).
       - How the move affects the entire game and position negatively (if applicable).
       - Whether such moves should generally be avoided or if it's specific to this situation.
       - (anything else you think might be important)
    3. **Recommended Move:**
       - Best Move: {analysis["best_move"]}, and what this move accomplishes (include examples).
       - Why this move is considered the best (opens opportunities or maybe it is the best response to opponent's move, other possible reasons).
       - How this move positively affects the game and position.
       - Opportunities opened by this move.
       - (anything else you think might be important)
    4. **Other Recommendations:**
       - Include any other specific or general recommendations you would give a student (me). This may include anything you've noticed other than the specific move discussed earlier (opening, execution, general patterns, etc).
    """
    
    completion = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        # max_tokens=1000
    )
    return completion.choices[0].message.content 
