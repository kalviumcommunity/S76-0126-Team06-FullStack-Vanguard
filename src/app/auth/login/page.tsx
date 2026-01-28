import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Project Vanguard",
  description: "Sign in to Project Vanguard",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600" />
            <h1 className="text-2xl font-bold text-white">Vanguard</h1>
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-800/80 backdrop-blur rounded-lg border border-slate-700 shadow-2xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Sign in to your Vanguard account</p>
          </div>

          <form className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-300">
                <input type="checkbox" className="rounded w-4 h-4 bg-slate-700 border-slate-600" />
                Remember me
              </label>
              <a href="#" className="text-blue-500 hover:text-blue-400">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-lg transition duration-200"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-slate-400">Or</span>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-300 mb-3">Login as:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="px-4 py-2.5 rounded-lg bg-blue-600/20 border border-blue-500/50 text-blue-400 hover:bg-blue-600/30 transition font-medium text-sm"
              >
                📚 Student
              </button>
              <button
                type="button"
                className="px-4 py-2.5 rounded-lg bg-purple-600/20 border border-purple-500/50 text-purple-400 hover:bg-purple-600/30 transition font-medium text-sm"
              >
                👨‍🏫 Mentor
              </button>
            </div>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-blue-500 hover:text-blue-400 font-semibold">
              Create one now
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
