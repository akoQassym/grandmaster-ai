FROM python:3.12

WORKDIR /app

RUN apt update && \
    apt install -y stockfish

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY ./api ./api
COPY .env .

EXPOSE 8000

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]