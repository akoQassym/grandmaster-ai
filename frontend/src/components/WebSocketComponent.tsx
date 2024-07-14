import { useEffect, useState } from "react";

const WebSocketComponent: React.FC = () => {
    const [message, setMessage] = useState('');
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws');
        ws.onmessage = (event) => {
            setMessage(event.data);
        };
        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = () => {
        if (socket) {
        socket.send(input);
            setInput('');
        }
    };

    return (
        <div>
            <h1>WebSocket Test</h1>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
            <p>Received: {message}</p>
        </div>
    );
}

export default WebSocketComponent