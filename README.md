# Grandmaster AI Chess Coaching Tool with RAG-powered Explanations

## 1. Intro

### a. General Idea

This is a full-stack chess coaching tool that analyzes games using the Stockfish engine and provides human-readable, accurate explanations using GPT-4, enhanced by a Retrieval-Augmented Generation (RAG) system to ground AI-generated explanations in expert chess literature.

### b. Screenshot Banner

![Game Analysis and Explanation](./assets/banner.png)

*(Insert a screenshot showing the chess analysis by Stockfish and the AI-generated explanation)*

### c. Launch Day Statistics

- Launched a full-stack chess coaching tool, achieving 800+ page visits and 85+ signed users on the first day by delivering insightful game analysis using the Stockfish engine and GPT-4.
- Implemented a Retrieval-Augmented Generation (RAG) system, grounding AI-generated explanations in expert chess literature, enhancing accuracy across 100+ games analyzed.

### d. Stack

Stack: TypeScript, Python, Next.js, React, FastAPI, Elasticsearch, MongoDB, FAISS, OpenAI API, AWS, Docker

### e. Architecture

The architecture consists of:

- Frontend: A Next.js and React-based web interface for users to upload games, view analysis, and receive explanations.
- Backend: FastAPI handles game analysis requests, retrieves documents from Elasticsearch and MongoDB, and integrates with the OpenAI API for explanation generation.
- Stockfish: Analyzes chess positions and generates evaluation and move recommendations.
- RAG System: Retrieval-Augmented Generation (RAG) system pulls relevant chess literature from Elasticsearch to enhance explanation accuracy.
- Database: MongoDB stores user data and game analysis results, while Elasticsearch is used for storing and retrieving expert chess literature.
- Deployment: The entire system is containerized using Docker and deployed on AWS for scalability and reliability.

## 2. How to Build It

To build this project, follow these steps:

1. Clone the repository:

```bash
   git clone https://github.com/your-username/chess-coaching-tool.git
   cd chess-coaching-tool
```

2. Install dependencies:

- For the frontend (Next.js/React):

```bash
    cd frontend
    npm install
```

- For the backend (FastAPI):

```bash
    cd backend
    pip install -r requirements.txt
```
     
3. Set up environment variables:

Create a .env file in both frontend and backend directories with the following keys:

- For the frontend:
    
```bash
    NEXT_PUBLIC_API_URL=http://localhost:8000
```

- For the backend:
    
```bash
    OPENAI_API_KEY=your_openai_api_key
    MONGO_URI=mongodb+srv://your_mongo_connection_string
    ELASTICSEARCH_URL=http://localhost:9200
```

4. Build the frontend:
   
```bash
    cd frontend
    npm run build
```

## 3. How to Run It

1. Run MongoDB and Elasticsearch:

- Start MongoDB locally or use a cloud provider (e.g., MongoDB Atlas).
- Start Elasticsearch (make sure it's running on the correct port).

You can use Docker to spin up these services easily:

```bash
    docker-compose up -d
```

2. Run the Backend:

```bash
   cd backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

3. Run the Frontend:

```bash
   cd frontend
   npm run dev
```

4. Access the Application:

The app will be accessible on http://localhost:3000.

## 4. How to Use It

1. Upload Games:
   - On the homepage, enter your Lichess username or upload a PGN file to analyze your game.

2. Receive Analysis:
   - The backend will run the game through Stockfish, analyze the moves, and provide insights like blunders, mistakes, or best moves.

3. Get Human-Like Explanations:
   - The RAG system will enhance the explanations with information retrieved from expert chess literature, providing accurate and understandable insights on the reasoning behind certain moves.

4. Explore Your Games:
   - Review and study your games to improve your understanding of chess strategy and tactics.