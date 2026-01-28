import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Project Vanguard",
  description: "Create your Project Vanguard account",
};

export default function SignupPage() {
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
            <h2 className="text-2xl font-bold text-white mb-2">Join Vanguard</h2>
            <p className="text-slate-400">Create your account to get started</p>
          </div>

          <form className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                required
              />
            </div>

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
              <p className="text-xs text-slate-400 mt-1">At least 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                required
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-3 rounded-lg bg-slate-700/50 border border-slate-600 cursor-pointer hover:border-blue-500 transition">
                  <input type="radio" name="role" value="student" defaultChecked />
                  <span className="text-slate-300">📚 Student</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-lg bg-slate-700/50 border border-slate-600 cursor-pointer hover:border-blue-500 transition">
                  <input type="radio" name="role" value="mentor" />
                  <span className="text-slate-300">👨‍🏫 Mentor</span>
                </label>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 text-sm text-slate-400">
              <input type="checkbox" className="rounded w-4 h-4 bg-slate-700 border-slate-600 mt-0.5" required />
              <span>
                I agree to the{" "}
                <a href="#" className="text-blue-500 hover:text-blue-400">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-500 hover:text-blue-400">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 mt-6"
            >
              Create Account
            </button>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-slate-400">
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-500 hover:text-blue-400 font-semibold">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
