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

  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (id: string) => void;
  updateCursor: (
    id: string,
    pos: { lineNumber: number; column: number }
  ) => void;
  appendTerminalOutput: (text: string) => void;
  clearTerminal: () => void;
  setIsRunning: (isRunning: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  code: "// Start coding...",
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

  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  addParticipant: (p) =>
    set((state) => ({ participants: [...state.participants, p] })),
  removeParticipant: (id) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.id !== id),
    })),
  updateCursor: (id, pos) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p.id === id ? { ...p, cursorPos: pos } : p
      ),
    })),
  appendTerminalOutput: (text) =>
    set((state) => ({ terminalOutput: state.terminalOutput + text })),
  clearTerminal: () => set({ terminalOutput: "" }),
  setIsRunning: (isRunning) => set({ isRunning }),
}));
