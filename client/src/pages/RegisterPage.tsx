import { motion } from "framer-motion";
import { AuthLayout } from "../components/AuthLayout";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";

export const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(username, email, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.response?.data || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign Up" subtitle="Join the network.">
      <form className="space-y-3.5" onSubmit={handleRegister}>
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-2 px-3 rounded-lg text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-xs py-2 px-3 rounded-lg text-center">
            Registration successful! Redirecting to login...
          </div>
        )}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-white/30 uppercase tracking-widest ml-1">
            Username
          </label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-accent-purple transition-colors" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-accent-purple/40 focus:bg-white/[0.07] transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-white/30 uppercase tracking-widest ml-1">
            Email
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within:text-accent-purple transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-accent-purple/40 focus:bg-white/[0.07] transition-all"
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
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-accent-purple/40 focus:bg-white/[0.07] transition-all"
              required
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading || success}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 0 15px rgba(124, 58, 237, 0.3)",
          }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-accent-purple text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:brightness-110 mt-4 shadow-lg shadow-accent-purple/10 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign Up"}
          {!loading && !success && <ArrowRight className="w-4 h-4" />}
        </motion.button>
      </form>

      <p className="mt-8 text-center text-sm text-white/40">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-accent-cyan hover:underline font-medium"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};
