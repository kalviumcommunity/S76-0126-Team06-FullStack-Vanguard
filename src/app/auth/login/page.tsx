'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'MENTOR'>('STUDENT');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        // Redirection logic
        if (role === 'MENTOR') {
          router.push('/dashboard/mentor');
        } else {
          router.push('/dashboard/student');
        }
      }
    } catch (err: any) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Vanguard</h1>
          </div>
        </Link>

        {/* Card */}
        <div className="bg-[#1a1a1a] backdrop-blur rounded-2xl border border-gray-800 shadow-2xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your Vanguard account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Demo Credentials */}
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-sm text-blue-400 font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-400">Student: student@vanguard.com / student123</p>
            <p className="text-xs text-gray-400">Mentor: mentor@vanguard.com / mentor123</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Login as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm ${role === 'STUDENT'
                    ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981]'
                    : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                >
                  📚 Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('MENTOR')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm ${role === 'MENTOR'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                    : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                >
                  👨‍🏫 Mentor
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 transition"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300">
                <input
                  type="checkbox"
                  className="rounded w-4 h-4 bg-[#0f0f0f] border-gray-700 text-[#10b981] focus:ring-[#10b981]"
                />
                Remember me
              </label>
              <a href="#" className="text-[#10b981] hover:text-[#059669]">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#10b981]/20"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">Don't have an account? </span>
            <Link href="/auth/signup" className="text-[#10b981] hover:text-[#059669] font-medium">
              Sign up
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-300 transition">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
