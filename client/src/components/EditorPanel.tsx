import Editor, { type Monaco } from "@monaco-editor/react";
import { useEditorStore } from "../store/useEditorStore";
import { socketService } from "../services/socketService";
import { useRef, useEffect } from "react";

// Ensure Monaco loader is configured if needed (usually defaults are fine)
// Loader.config({ paths: { vs: "..." } });

export const EditorPanel = () => {
  const { code, language, setCode, participants, roomId, user } =
    useEditorStore();
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Listen for cursor changes
    editor.onDidChangeCursorPosition((e: any) => {
      socketService.sendCursorMove(e.position.lineNumber, e.position.column);
    });

    console.log("Editor mounted");
  };

  const handleEditorWillMount = (monaco: Monaco) => {
    // Define Custom "Space" Theme
    monaco.editor.defineTheme("space-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6272a4", fontStyle: "italic" },
        { token: "keyword", foreground: "ff79c6" },
        { token: "string", foreground: "f1fa8c" },
        { token: "identifier", foreground: "8be9fd" },
        { token: "type", foreground: "8be9fd" },
        { token: "function", foreground: "50fa7b" },
        { token: "number", foreground: "bd93f9" },
        { token: "delimiter", foreground: "f8f8f2" },
      ],
      colors: {
        "editor.background": "#0b0e14", // Space Dark
        "editor.foreground": "#f8f8f2",
        "editor.selectionBackground": "#44475a",
        "editor.lineHighlightBackground": "#1a1d23", // Slightly lighter
        "editorCursor.foreground": "#f8f8f2",
        "editorWhitespace.foreground": "#3b3a32",
        "editorIndentGuide.background": "#3b3a32",
        "editorIndentGuide.activeBackground": "#f8f8f2",
      },
    });
  };

  const handleChange = (value: string | undefined) => {
    if (value !== undefined && value !== code) {
      setCode(value);
      socketService.sendCodeChange(value);
    }
  };

  // Connect/Reconnect to WebSocket when roomId changes
  useEffect(() => {
    if (!roomId) return;

    // Disconnect previous session if any
    socketService.disconnect();

    // Connect to the new room
    const username = user?.username || "Anonymous";
    socketService.connect(roomId, username);

    console.log(`Connected to room: ${roomId} as ${username}`);

    return () => {
      socketService.disconnect();
    };
  }, [roomId, user?.username]);
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    // Example: Render decorations for other participants
    // const decorations = participants.filter(p => p.id !== 'me').map(...)
    // editorRef.current.deltaDecorations([], decorations);
  }, [participants]);

  return (
    <div className="h-full w-full overflow-hidden bg-space-dark relative">
      {/* Glowing effect behind editor logic could go here */}
      <div className="absolute inset-0 bg-accent-purple/5 pointer-events-none" />

      <Editor
        height="100%"
        language={language}
        value={code}
        theme="space-theme"
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        onChange={handleChange}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          fontFamily: '"Fira Code", monospace',
          fontLigatures: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
        }}
        loading={
          <div className="text-accent-cyan flex items-center justify-center p-4">
            Loading Editor...
          </div>
        }
      />
    </div>
  );
};
