'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { UserPlus, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'MENTOR'>('STUDENT');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Auto login after signup
      await signIn('credentials', {
        redirect: true,
        callbackUrl: role === 'MENTOR' ? '/dashboard/mentor' : '/dashboard/student',
        email,
        password,
      });
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] px-4 py-12">
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
            <h2 className="text-3xl font-bold text-white mb-2">Join Vanguard</h2>
            <p className="text-gray-400">Create your account to get started</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Sign up as:
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

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 transition"
                required
              />
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
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 transition"
                required
              />
            </div>

            {/* Terms Checkbox */}
            <div>
              <label className="flex items-start gap-3 text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 rounded w-4 h-4 bg-[#0f0f0f] border-gray-700 text-[#10b981] focus:ring-[#10b981]"
                />
                <span>
                  I agree to the{' '}
                  <a href="#" className="text-[#10b981] hover:text-[#059669]">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[#10b981] hover:text-[#059669]">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#10b981]/20"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">Already have an account? </span>
            <Link href="/auth/login" className="text-[#10b981] hover:text-[#059669] font-medium">
              Sign in
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
