import { useState } from 'react';
import { Lock, Mail, Loader2, ShieldCheck, AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AdminLogin() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await signIn(email, password, securityCode);
    if (signInError) {
      setError(signInError);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
            Admin Access
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            BRICS Infrastructure Demand AI — Secure Administration Panel
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 animate-slide-up">
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@brics-dpi.gov"
                  className="input-field pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secure password"
                  className="input-field pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Security Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Security Access Code
                <span className="ml-2 text-xs font-normal text-gray-400 dark:text-gray-500">
                  (30+ character secret key)
                </span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <textarea
                  required
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  placeholder="Enter your 30-50 character security access code"
                  className={`input-field pl-10 pr-10 py-2.5 min-h-[60px] resize-none font-mono text-sm tracking-wide ${
                    securityCode.length > 0 && securityCode.length < 30
                      ? 'border-warning-400 dark:border-warning-600'
                      : securityCode.length >= 30
                        ? 'border-success-400 dark:border-success-600'
                        : ''
                  }`}
                  autoComplete="off"
                  spellCheck={false}
                  rows={2}
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label={showCode ? 'Hide code' : 'Show code'}
                >
                  {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Character counter */}
              <div className="mt-1.5 flex items-center justify-between">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  This extra code is required along with email & password.
                </p>
                <span className={`text-xs font-mono tabular-nums ${
                  securityCode.length >= 30
                    ? 'text-success-600 dark:text-success-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {securityCode.length} chars
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 animate-slide-down">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || securityCode.length < 30}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Authenticating...</>
              ) : (
                <><ShieldCheck className="h-4 w-4" /> Secure Login</>
              )}
            </button>
          </div>

          {/* Security Note */}
          <div className="mt-6 rounded-xl bg-gray-50 dark:bg-gray-900/50 p-3 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Multi-layer protection: Supabase Auth + bcrypt hashing + secret access code.
              <br />Authorized personnel only. All access attempts are logged.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
