import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useEditorStore, type Participant } from "../store/useEditorStore";

export const MessageType = {
  JOIN_ROOM: "JOIN_ROOM",
  LEAVE_ROOM: "LEAVE_ROOM",
  CODE_CHANGE: "CODE_CHANGE",
  CURSOR_MOVE: "CURSOR_MOVE",
  PARTICIPANTS_UPDATE: "PARTICIPANTS_UPDATE",
  CODE_SYNC: "CODE_SYNC",
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];

interface SocketMessage {
  type: MessageType;
  roomId: string;
  payload: any;
}

export class SocketService {
  private static instance: SocketService;
  private client: Client | null = null;
  private roomId: string | null = null;
  private isConnected: boolean = false;
  private name: string | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(
    roomId: string,
    name: string = "Anonymous",
    url: string = (import.meta.env.VITE_API_BASE_URL ||
      "http://localhost:8080") + "/ws",
  ) {
    if (this.isConnected) return;

    this.roomId = roomId;
    this.name = name;

    this.client = new Client({
      brokerURL: url.replace("http", "ws"), // Fallback if no webSocketFactory
      webSocketFactory: () => new SockJS(url),
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame) => {
      this.isConnected = true;
      console.log("Connected to WebSocket", frame);

      // Subscribe to room updates
      this.client?.subscribe(`/topic/room/${roomId}`, (message) => {
        const body: SocketMessage = JSON.parse(message.body);
        this.handleIncomingMessage(body);
      });

      // Join the room
      this.joinRoom(name);
    };

    this.client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
      this.isConnected = false;
    };

    this.client.activate();
  }

  public disconnect() {
    if (this.client) {
      if (this.roomId && this.isConnected) {
        this.send(
          {
            type: MessageType.LEAVE_ROOM,
            roomId: this.roomId,
            payload: {},
          },
          "/app/room.leave",
        );
      }
      this.client.deactivate();
      this.client = null;
      this.isConnected = false;
    }
  }

  private joinRoom(name: string) {
    this.send(
      {
        type: MessageType.JOIN_ROOM,
        roomId: this.roomId!,
        payload: {
          name,
          avatar:
            useEditorStore.getState().user?.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        },
      },
      "/app/room.join",
    );
  }

  public sendCodeChange(code: string) {
    if (!this.isConnected) return;
    this.send(
      {
        type: MessageType.CODE_CHANGE,
        roomId: this.roomId!,
        payload: { code },
      },
      "/app/code.change",
    );
  }

  public sendCursorMove(lineNumber: number, column: number) {
    if (!this.isConnected) return;
    this.send(
      {
        type: MessageType.CURSOR_MOVE,
        roomId: this.roomId!,
        payload: { lineNumber, column },
      },
      "/app/cursor.move",
    );
  }

  private send(message: SocketMessage, destination: string) {
    if (this.client && this.isConnected) {
      this.client.publish({
        destination,
        body: JSON.stringify(message),
      });
    }
  }

  private handleIncomingMessage(message: SocketMessage) {
    const store = useEditorStore.getState();

    switch (message.type) {
      case MessageType.PARTICIPANTS_UPDATE: {
        const rawParticipants: any[] = message.payload;

        const mappedParticipants: Participant[] = rawParticipants.map((p) => ({
          id: p.sessionId,
          name: p.name,
          avatar: p.avatar,
          color: p.color,
          isOnline:
            p.isOnline !== undefined
              ? p.isOnline
              : p.online !== undefined
                ? p.online
                : true,
        }));

        store.setParticipants(mappedParticipants);
        break;
      }
      case MessageType.CODE_CHANGE: {
        const { code } = message.payload;
        // In a real app we'd compare senderSessionId with our own sessionId
        // For now, let's assume we handle loop prevention in the component
        store.setCode(code);
        break;
      }
      case MessageType.CURSOR_MOVE: {
        const { senderSessionId, lineNumber, column } = message.payload;
        if (senderSessionId) {
          store.updateCursor(senderSessionId, { lineNumber, column });
        }
        break;
      }
      case MessageType.CODE_SYNC: {
        const { code, language, targetName } = message.payload;
        if (targetName === this.name) {
          store.setCode(code);
          if (language) store.setLanguage(language);
        }
        break;
      }
    }
  }
}

export const socketService = SocketService.getInstance();
