import { Trash2, Terminal as TerminalIcon, Activity } from "lucide-react";
import { useEditorStore } from "../store/useEditorStore";
import { useEffect, useRef } from "react";

export const Terminal = () => {
  const { terminalOutput, clearTerminal, isRunning } = useEditorStore();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  return (
    <div className="h-full flex flex-col bg-space-dark border-t border-white/10">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-space-light/30">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <TerminalIcon className="w-4 h-4" />
          <span>Terminal</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Activity
              className={`w-3 h-3 ${
                isRunning ? "text-accent-cyan animate-pulse" : "text-gray-600"
              }`}
            />
            <span className={isRunning ? "text-accent-cyan" : "text-gray-600"}>
              {isRunning ? "Running" : "Idle"}
            </span>
          </div>
          <button
            onClick={clearTerminal}
            className="p-1 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
            title="Clear Terminal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={contentRef}
        className="flex-1 p-4 font-mono text-sm text-gray-300 overflow-y-auto whitespace-pre-wrap selection:bg-accent-purple/30"
      >
        {terminalOutput || (
          <span className="text-gray-600 italic">No output...</span>
        )}
      </div>
    </div>
  );
};
