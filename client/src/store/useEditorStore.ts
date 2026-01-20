import { create } from "zustand";

export interface Participant {
  id: string; // This maps to sessionId from backend
  name: string;
  avatar: string;
  color: string;
  isOnline: boolean;
  cursorPos?: { lineNumber: number; column: number };
}

interface EditorState {
  code: string;
  language: string;
  participants: Participant[];
  terminalOutput: string;
  isRunning: boolean;
  roomId: string;
  user: { username: string; token: string; avatar: string } | null;

  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setParticipants: (participants: Participant[]) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (id: string) => void;
  updateCursor: (
    id: string,
    pos: { lineNumber: number; column: number },
  ) => void;
  appendTerminalOutput: (text: string) => void;
  clearTerminal: () => void;
  setIsRunning: (isRunning: boolean) => void;
  setRoomId: (roomId: string) => void;
  setUser: (
    user: { username: string; token: string; avatar: string } | null,
  ) => void;
}

const BOILERPLATES: Record<string, string> = {
  javascript: `// JavaScript Playground\n\nfunction greet(name) {\n  console.log("Hello, " + name + "!");\n}\n\ngreet("SyncCode User");\n`,
};

const getInitialUser = (): {
  username: string;
  token: string;
  avatar: string;
} | null => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const parsed = JSON.parse(userStr);
      return {
        username: parsed.username,
        token: parsed.token,
        avatar:
          parsed.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${parsed.username}`,
      };
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const useEditorStore = create<EditorState>((set) => ({
  code: BOILERPLATES.javascript,
  language: "javascript",
  participants: [],
  terminalOutput: "> Ready to run code...\n",
  isRunning: false,
  roomId: "",
  user: getInitialUser(),

  setCode: (code) => set({ code }),
  setLanguage: (language) =>
    set((state) => ({
      language,
      code:
        !state.code ||
        state.code === BOILERPLATES.javascript ||
        state.code === "// Start coding..."
          ? BOILERPLATES.javascript
          : state.code,
    })),
  setParticipants: (participants) => set({ participants }),
  addParticipant: (p) =>
    set((state) => ({ participants: [...state.participants, p] })),
  removeParticipant: (id) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.id !== id),
    })),
  updateCursor: (id, pos) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p.id === id ? { ...p, cursorPos: pos } : p,
      ),
    })),
  appendTerminalOutput: (text) =>
    set((state) => ({ terminalOutput: state.terminalOutput + text })),
  clearTerminal: () => set({ terminalOutput: "" }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setRoomId: (roomId) => set({ roomId }),
  setUser: (user) => set({ user }),
}));
