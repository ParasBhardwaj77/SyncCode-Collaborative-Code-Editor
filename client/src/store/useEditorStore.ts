import { create } from "zustand";

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  color: string; // Cursor color
  cursorPos?: { lineNumber: number; column: number };
}

interface EditorState {
  code: string;
  language: string;
  participants: Participant[];
  terminalOutput: string;
  isRunning: boolean;
  roomId: string;
  user: { username: string; token: string } | null;

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
  setUser: (user: { username: string; token: string } | null) => void;
}

const BOILERPLATES: Record<string, string> = {
  javascript: `// JavaScript Playground\n\nfunction greet(name) {\n  console.log("Hello, " + name + "!");\n}\n\ngreet("SyncCode User");\n`,
};

const getInitialUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const useEditorStore = create<EditorState>((set) => ({
  code: BOILERPLATES.javascript,
  language: "javascript",
  participants: [
    {
      id: "1",
      name: "You",
      avatar: "https://github.com/shadcn.png",
      color: "#7c3aed",
    },
    {
      id: "2",
      name: "Alice",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      color: "#06b6d4",
    },
  ],
  terminalOutput: "> Ready to run code...\n",
  isRunning: false,
  roomId: "default-room",
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
