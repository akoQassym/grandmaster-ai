from openai import OpenAI
import os


client = OpenAI(
    api_key = os.getenv('OPENAI_API_KEY'),
)

async def generate_explanation(analysis):
    prompt = f"""
    You are a Grandmaster Chess Coach/Mentor. You will be provided with a chess analysis report done by the StockFish engine. 
    Your task is to explain the reasoning behind the following analysis as a teacher would to a student eager to learn and improve.
    Focus on being a teacher, explaining why certain moves are considered mistakes, blunders, missed wins, or good moves, and describe the possible implications of these moves.
    Be detailed and pedagogical in your explanations, ensuring the student understands the chess concepts and strategies involved. 
    Use clear and simple language, provide examples when necessary, and break down complex concepts into easy-to-understand parts.

    Here is the analysis report:
    {analysis}
    """
    
    completion = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a Grandmaster Chess Teacher, who explains the students why their moves are good or bad in simple language."},
            {"role": "user", "content": prompt}
        ],
        # max_tokens=1000
    )
    return completion.choices[0].message.content 
