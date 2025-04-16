import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'parent' | 'admin'>('parent');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userType === 'parent') {
      navigate('/parent-dashboard');
    } else {
      navigate('/admin-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center p-4 font-orbitron">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-10 w-full max-w-md text-white"
      >
        <div className="flex items-center justify-center mb-8">
          <Bus className="h-12 w-12 text-cyan-400 drop-shadow-glow" />
          <h1 className="text-3xl font-bold ml-3 tracking-wide">SchoolBus Tracker</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Login As</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUserType('parent')}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  userType === 'parent'
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'bg-white/20 hover:bg-white/30 text-white border border-white/10'
                }`}
              >
                Parent
              </button>
              <button
                type="button"
                onClick={() => setUserType('admin')}
                className={`py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  userType === 'admin'
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'bg-white/20 hover:bg-white/30 text-white border border-white/10'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-md bg-white/20 text-white placeholder-white/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-white/20"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md bg-white/20 text-white placeholder-white/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 border border-white/20"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-md tracking-wide transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
          >
            Sign In
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
