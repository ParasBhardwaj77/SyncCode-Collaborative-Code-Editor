// Enhanced Sidebar with full width design
import { useEditorStore } from "../store/useEditorStore";
import { Users, Wifi } from "lucide-react";

export const Sidebar = () => {
  const participants = useEditorStore((state) => state.participants);

  return (
    <aside className="w-full flex flex-col h-full bg-space-dark/50 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <Users className="text-accent-purple w-5 h-5" />
        <span className="text-sm font-semibold tracking-wide text-gray-200 uppercase">
          Participants
        </span>
        <span className="ml-auto text-xs bg-accent-purple/20 text-accent-purple px-2 py-0.5 rounded-full">
          {participants.length}
        </span>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
        {participants.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer"
          >
            {/* Avatar Ring */}
            <div
              className="relative w-8 h-8 rounded-full overflow-hidden border transition-all duration-300 group-hover:shadow-[0_0_10px_var(--color)]"
              style={
                {
                  borderColor: p.color,
                  "--color": p.color,
                } as React.CSSProperties
              }
            >
              <img
                src={p.avatar}
                alt={p.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name & Status */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-200 truncate leading-none">
                {p.name}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    p.isOnline ? "bg-green-500 animate-pulse" : "bg-gray-500"
                  }`}
                />
                <span className="text-[10px] text-gray-400">
                  {p.isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            {/* Connection Icon (Decoration) */}
            <Wifi className="w-3 h-3 text-gray-600 group-hover:text-gray-400 transition-colors" />
          </div>
        ))}
      </div>

      {/* Footer / Room Info */}
      <div className="p-4 border-t border-white/10 text-xs text-center text-gray-500">
        SyncCode Elite v1.0
      </div>
    </aside>
  );
};
