import * as WebSocket from 'ws';

setTimeout(() => {
    // Create a WebSocket connection to the server
    const ws = new WebSocket('ws://localhost:8080');

    const wait = (ms: number) => {
        return new Promise((res: any) => setTimeout(res, ms))
    }

    // Event listener for when the WebSocket connection is established
    ws.on('open', async () => {
        console.log('Connected to WebSocket server');
        while(true){
            await wait(Math.random() * 1000)
            ws.send(JSON.stringify([
                (Math.random() * 100).toFixed(0),
                (Math.random() * 100).toFixed(0),
                (Math.random() * 100).toFixed(0),
                (Math.random() * 100).toFixed(0),
                (Math.random() * 100).toFixed(0),
                (Math.random() * 100).toFixed(0),
                (Math.random() * 100).toFixed(0),
                (Math.random() * 100).toFixed(0),
            ]));
        }
    });

    // Event listener for when the WebSocket connection is closed
    ws.on('close', () => {
        console.log('Disconnected from WebSocket server');
    });
}, 7000)