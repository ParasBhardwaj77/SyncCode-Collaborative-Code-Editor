import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthLayout } from "../components/AuthLayout";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { login } from "../services/authService";
import { useEditorStore } from "../store/useEditorStore";

export const LoginPage = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setUser = useEditorStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(usernameOrEmail, password);
      setUser({
        username: data.username,
        token: data.token,
        avatar:
          data.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
      });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Login" subtitle="Sign in to your account.">
      <form className="space-y-4" onSubmit={handleLogin}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-2 px-3 rounded-lg text-center">
            {error}
          </div>
        )}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-white/30 uppercase tracking-widest ml-1">
            Username or Email
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-accent-purple transition-colors" />
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="Enter your username or email"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-accent-purple/40 focus:bg-white/[0.07] transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-white/30 uppercase tracking-widest ml-1">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-accent-purple transition-colors" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-accent-purple/40 focus:bg-white/[0.07] transition-all"
              required
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 0 15px rgba(124, 58, 237, 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-accent-purple text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-accent-purple/10 transition-all hover:brightness-110 mt-2 disabled:opacity-50"
        >
          {loading ? "Authenticating..." : "Login"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </motion.button>
      </form>

      <p className="mt-8 text-center text-sm text-white/40">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-accent-cyan hover:underline font-medium"
        >
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
};
