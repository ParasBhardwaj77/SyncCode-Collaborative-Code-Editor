import { Play, Code2, ChevronDown, Plus, Users } from "lucide-react";
import { useEditorStore } from "../store/useEditorStore";
import { useState, useRef, useEffect } from "react";

export const Navbar = () => {
  const { language, isRunning, setIsRunning, appendTerminalOutput } =
    useEditorStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleRun = () => {
    setIsRunning(true);
    appendTerminalOutput("> Running code...\n");
    setTimeout(() => {
      appendTerminalOutput(
        "Hello Universe!\n> Process finished with exit code 0\n"
      );
      setIsRunning(false);
    }, 1500);
  };

  return (
    <nav className="h-16 border-b border-white/10 bg-space-dark/80 backdrop-blur-lg flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-accent-purple/20 p-2 rounded-lg">
          <Code2 className="text-accent-purple w-6 h-6" />
        </div>
        <h1 className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          SyncCode <span className="text-accent-cyan font-light">Elite</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-2 bg-space-light/50 border px-3 py-1.5 rounded-md text-sm transition-colors ${
              isDropdownOpen
                ? "border-accent-purple text-white"
                : "border-white/10 hover:border-accent-purple/50"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                language === "java"
                  ? "bg-red-500"
                  : language === "typescript"
                  ? "bg-blue-500"
                  : language === "python"
                  ? "bg-green-500"
                  : "bg-yellow-400"
              }`}
            />
            <span className="capitalize">{language}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : "opacity-50"
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-40 bg-space-dark border border-white/10 rounded-md shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
              {["javascript", "typescript", "java", "python"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    useEditorStore.getState().setLanguage(lang);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-accent-purple/20 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      lang === "java"
                        ? "bg-red-500"
                        : lang === "typescript"
                        ? "bg-blue-500"
                        : lang === "python"
                        ? "bg-green-500"
                        : "bg-yellow-400"
                    }`}
                  />
                  <span className="capitalize">{lang}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-2 bg-accent-purple hover:bg-accent-purple/90 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4 fill-current" />
          {isRunning ? "Running..." : "Run Code"}
        </button>

        <button className="flex items-center gap-2 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-accent-cyan/20 transition-all">
          <Plus className="w-4 h-4" />
          Create Room
        </button>

        <button className="flex items-center gap-2 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-accent-cyan/20 transition-all">
          <Users className="w-4 h-4" />
          Join Room
        </button>

        <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 hover:text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-white/10 transition-all">
          Login
        </button>
      </div>
    </nav>
  );
};
