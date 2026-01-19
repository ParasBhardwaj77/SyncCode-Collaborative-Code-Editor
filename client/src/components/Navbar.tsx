import { Play, Code2, Plus, Users, Copy, X, Check, LogOut } from "lucide-react";
import { useEditorStore } from "../store/useEditorStore";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { executeCode } from "../services/executionService";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const {
    code,
    language,
    isRunning,
    setIsRunning,
    appendTerminalOutput,
    clearTerminal,
    roomId,
    setRoomId,
    user,
    setUser,
  } = useEditorStore();

  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState<"create" | "join" | null>(
    null,
  );
  const [joinId, setJoinId] = useState("");
  const [copied, setCopied] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    clearTerminal();
    appendTerminalOutput(`> Running ${language} code...\n`);

    try {
      const result = await executeCode(language, code);
      const output =
        result.run.stdout || result.run.stderr || "> No output from execution.";
      appendTerminalOutput(output + "\n");
      if (result.run.code !== 0) {
        appendTerminalOutput(
          `> Process finished with exit code ${result.run.code}\n`,
        );
      } else {
        appendTerminalOutput(`> Process finished successfully.\n`);
      }
    } catch (err: any) {
      appendTerminalOutput(
        `> Error: ${err.response?.data?.error || err.message}\n`,
      );
    } finally {
      setIsRunning(false);
    }
  };

  const handleCreateRoom = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const newId = Math.random().toString(36).substring(2, 10).toUpperCase();
    setRoomId(newId);
    setActiveModal("create");
  };

  const handleJoinRoom = () => {
    if (joinId.trim()) {
      setRoomId(joinId.trim());
      setActiveModal(null);
      setJoinId("");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="h-16 border-b border-white/10 bg-space-dark/80 backdrop-blur-lg flex items-center justify-between px-6 z-50 relative">
      <div className="flex items-center gap-3">
        <div className="bg-accent-purple/20 p-2 rounded-lg">
          <Code2 className="text-accent-purple w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-bold text-lg leading-none tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            SyncCode <span className="text-accent-cyan font-light">Elite</span>
          </h1>
          {user && (
            <span className="text-[10px] text-white/40 mt-1 font-mono uppercase tracking-widest">
              Room: {roomId}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Static JavaScript Badge */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-sm text-white">
          <span className="w-2 h-2 rounded-full bg-yellow-400" />
          <span className="capitalize">JavaScript</span>
        </div>

        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-2 bg-accent-purple hover:bg-accent-purple/90 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4 fill-current" />
          {isRunning ? "Running..." : "Run Code"}
        </button>

        <button
          onClick={handleCreateRoom}
          className="flex items-center gap-2 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-accent-cyan/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Room
        </button>

        <button
          onClick={() => {
            if (!user) {
              navigate("/login");
            } else {
              setActiveModal("join");
            }
          }}
          className="flex items-center gap-2 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-accent-cyan/20 transition-all"
        >
          <Users className="w-4 h-4" />
          Join Room
        </button>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-white/80">
              Hi, <span className="text-accent-cyan">{user.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-red-400 transition-all group relative"
              title="Logout"
            >
              <LogOut className="w-4.5 h-4.5" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-space-dark border border-white/10 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Logout
              </span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 hover:text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-white/10 transition-all text-center"
          >
            Login
          </Link>
        )}
      </div>

      {/* Modals Overlay */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-space-dark border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden"
            >
              {/* Decorative Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-purple/20 blur-[60px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-cyan/20 blur-[60px] rounded-full pointer-events-none" />

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {activeModal === "create" ? "Room Created!" : "Join a Room"}
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/50" />
                </button>
              </div>

              {activeModal === "create" ? (
                <div className="space-y-4">
                  <p className="text-sm text-white/60">
                    Share this Room ID with your colleagues to start
                    collaborating in real-time.
                  </p>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-3 rounded-xl">
                    <code className="flex-1 text-center text-2xl font-bold tracking-[0.2em] text-accent-cyan font-mono">
                      {roomId}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="p-2 bg-accent-purple text-white rounded-lg hover:bg-accent-purple/90 transition-all shadow-lg active:scale-95"
                    >
                      {copied ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-white/60">
                    Enter the Room ID provided by your colleague to join their
                    session.
                  </p>
                  <input
                    type="text"
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value.toUpperCase())}
                    placeholder="Enter Room ID (e.g. X1Y2Z3W4)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-purple transition-colors text-center text-lg tracking-widest font-mono"
                    autoFocus
                  />
                  <button
                    onClick={handleJoinRoom}
                    disabled={!joinId.trim()}
                    className="w-full py-3 bg-accent-purple hover:bg-accent-purple/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Users className="w-5 h-5" />
                    Join Room Now
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
};
