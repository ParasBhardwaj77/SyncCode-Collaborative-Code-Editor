// Scalable Layout with Custom Resize Logic
import { useState, useCallback, useRef, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { EditorPanel } from "./EditorPanel";
import { Terminal } from "./Terminal";
import { Navbar } from "./Navbar";

export const Layout = () => {
  // Terminal Height State (default 256px)
  const [terminalHeight, setTerminalHeight] = useState(256);
  const isResizing = useRef(false);

  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none"; // Prevent text selection
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = "default";
    document.body.style.userSelect = "auto";
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing.current) {
      // Calculate new height: window height - mouse Y position
      // We subtract a bit to account for footer/padding if needed, but raw calc is usually fine.
      const newHeight = window.innerHeight - e.clientY;
      // Constraints: Min 32px (collapsed-ish) to Max 80% of screen
      if (newHeight > 32 && newHeight < window.innerHeight * 0.8) {
        setTerminalHeight(newHeight);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div className="fixed inset-0 flex flex-col bg-space-dark text-white overflow-hidden font-sans">
      {/* Top Navigation */}
      <div className="flex-none z-50">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        {/* Sidebar - Fixed Width */}
        <aside className="w-64 flex-none border-r border-white/10 flex flex-col bg-space-dark/95 backdrop-blur-sm z-40">
          <Sidebar />
        </aside>

        {/* Center - Editor & Terminal */}
        <div className="flex-1 flex flex-col min-w-0 bg-space-dark relative z-0">
          {/* Editor - Takes available space */}
          <main className="flex-1 min-h-0 relative">
            <EditorPanel />
          </main>

          {/* Resizer Handle */}
          <div
            className="h-1 bg-white/10 hover:bg-accent-purple cursor-row-resize transition-colors z-50 hover:h-1.5 active:bg-accent-purple"
            onMouseDown={startResizing}
          />

          {/* Terminal - Dynamic Height */}
          <footer
            className="flex-none border-t border-white/10 flex flex-col relative z-30 overflow-hidden"
            style={{ height: terminalHeight }}
          >
            <Terminal />
          </footer>
        </div>
      </div>
    </div>
  );
};
