import { motion } from "framer-motion";
import { Code2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-space-dark flex items-center justify-center p-4 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Nebulas */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-accent-purple/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-accent-cyan/10 blur-[100px] rounded-full"
        />

        {/* Animated Stars/Particles (CSS only for performance) */}
        <div className="absolute inset-0 star-pattern opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[360px] relative z-10"
      >
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden group">
          {/* Subtle line glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-purple/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="flex flex-col items-center mb-6">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-accent-purple/20 p-3.5 rounded-2xl mb-3 border border-accent-purple/20"
            >
              <Code2 className="w-7 h-7 text-accent-purple" />
            </motion.div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-white/40 text-[13px] mt-1.5">{subtitle}</p>
          </div>

          {children}
        </div>

        {/* Bottom Link Decoration */}
        <div className="mt-8 text-center text-sm text-white/40">
          © 2026 SyncCode Elite. Secure Terminal Protocol v1.0
        </div>
      </motion.div>
    </div>
  );
};
