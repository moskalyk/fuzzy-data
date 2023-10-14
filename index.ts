import * as fs from 'fs';
import * as crypto from 'crypto'
import * as WebSocket from 'ws';
import * as http from 'http';
import { ethers } from 'ethers'

const BLOCK_TIME_MS = 200

// Generate an Ethereum key pair
const wallet = ethers.Wallet.createRandom();

const wait = (ms: number) => {
    return new Promise((res) => setTimeout(res, ms))
};

let mem: any = [];

const encrypt = (mem: any) => {
    // Derive an encryption key from the Ethereum private key using PBKDF2
    const ethereumPrivateKey = wallet.privateKey;
    const salt = Buffer.from('some_salt'); // You should use a random salt
    const encryptionKey = crypto.pbkdf2Sync(ethereumPrivateKey, salt, 100000, 32, 'sha256');

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encryptedData = cipher.update(JSON.stringify(mem), 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    console.log('Encrypted Data:', encryptedData);
    
    // Decrypt data using the same encryption key
    const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');

    console.log('Decrypted Data:', JSON.parse(decryptedData));

    return encryptedData
}

(async () => {
    while(true) {
        await wait(BLOCK_TIME_MS)
        if(mem.length < 3){
            // loop and push a standardized data window
            while(mem.length < 3){
                mem.push([
                    100,
                    100,
                    100,
                    100,
                    100,
                    100,
                    100,
                    100
                ])
            }
        }
        const encmem = encrypt(mem);
        // Specify the file path you want to append to
        const filePath = './laser.txt';
        // Use the `fs.appendFile` method to append data to the file
        fs.appendFile(filePath, encmem + '\n', (err: any) => {
            mem = []
        });
    }
})()



// Create an HTTP server
const server = http.createServer((req: any, res: any) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket Server');
});

// Create a WebSocket server by passing the HTTP server
const wss = new WebSocket.Server({ server });

// Event listener for when a WebSocket connection is established
wss.on('connection', (ws: any) => {
  console.log('Client connected');

  // Event listener for when a message is received from a WebSocket client
  ws.on('message', (message: any) => {
    mem.push(JSON.parse(message))
  });

  // Event listener for when the WebSocket connection is closed
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the HTTP server on port 8080
server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});

