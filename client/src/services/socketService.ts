export class SocketService {
  private static instance: SocketService;
  private socket: WebSocket | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(url: string = "ws://localhost:3000") {
    console.log(`Connecting to ${url}...`);
    // Mock simulation
    setTimeout(() => {
      console.log("Connected to WebSocket");
    }, 500);
  }

  public disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  public sendCodeChange(code: string) {
    console.log("Sending code change:", code);
    // this.socket.send(JSON.stringify({ type: 'code-change', payload: code }));
  }

  public sendCursorMove(lineNumber: number, column: number) {
    console.log("Sending cursor move:", { lineNumber, column });
  }
}

export const socketService = SocketService.getInstance();
