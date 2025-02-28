import { vi, describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { io as Client, Socket as ClientSocket } from 'socket.io-client';

describe('Socket IO Tests', () => {
  const httpServer: ReturnType<typeof createServer> = createServer();
  const io: Server = new Server(httpServer);
  let clientSocket: ClientSocket;

  beforeAll(async () => {
    // Create an HTTP server and Socket.io server
    io.on('connection', (socket: Socket) => {});

    // Start server and wait until it's listening
    await new Promise<void>((resolve) => {
      httpServer.listen(3000, resolve);
    });
  });

  beforeEach(async () => {
    // Connect a client socket before each test
    clientSocket = Client('http://localhost:3000');

    await new Promise<void>((resolve) => {
      clientSocket.on('connect', resolve);
    });
  });

  afterEach(() => {
    // Disconnect the client socket after each test
    clientSocket.disconnect();
  });

  afterAll(() => {
    // Close the server after all tests
    io.close();
    httpServer.close();
  });

  it('Connection with server', () => {
    expect(clientSocket.connected).toBe(true);
  });
});
