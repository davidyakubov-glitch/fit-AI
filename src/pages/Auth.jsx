import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dumbbell, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';

const INPUT_CLASS = "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white";

export default function Auth() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialMode = urlParams.get('mode') || 'login';

  const [mode, setMode] = useState(initialMode); // login | signup | reset
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (mode !== 'reset') {
      if (!form.password) e.password = 'Password is required';
      else if (form.password.length < 8) e.password = 'Min 8 characters';
    }
    if (mode === 'signup') {
      if (!form.fullName.trim()) e.fullName = 'Full name is required';
      if (!consentAccepted) e.consent = 'You must accept the Privacy Policy to sign up';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (mode === 'login') {
        await base44.auth.loginViaEmailPassword(form.email, form.password);
        window.location.href = createPageUrl('Workout');
      } else if (mode === 'signup') {
        await base44.auth.register({ email: form.email, password: form.password, full_name: form.fullName });
        toast.success('Account created! Welcome aboard 🎉');
        window.location.href = createPageUrl('Workout');
      } else if (mode === 'reset') {
        await base44.auth.sendPasswordResetEmail(form.email);
        toast.success('Password reset email sent. Check your inbox.');
        setMode('login');
      }
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('already') || msg.includes('exists')) {
        setErrors({ email: 'An account with this email already exists' });
      } else if (msg.includes('Invalid') || msg.includes('credentials') || msg.includes('password')) {
        setErrors({ password: 'Incorrect email or password' });
      } else {
        toast.error(msg || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 mb-4 shadow-lg">
            <Dumbbell className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AI Fitness Coach</h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'login' && 'Welcome back'}
            {mode === 'signup' && 'Create your free account'}
            {mode === 'reset' && 'Reset your password'}
          </p>
        </div>

        <Card className="shadow-xl border-0 rounded-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name (signup only) */}
              {mode === 'signup' && (
                <div>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={form.fullName}
                    onChange={e => set('fullName', e.target.value)}
                    className={INPUT_CLASS}
                    autoComplete="name"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
              )}

              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  className={INPUT_CLASS}
                  autoComplete="email"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              {mode !== 'reset' && (
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    className={INPUT_CLASS + ' pr-12'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
              )}

              {/* Forgot password link */}
              {mode === 'login' && (
                <div className="text-right">
                  <button type="button" onClick={() => setMode('reset')} className="text-purple-600 text-xs hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Consent (signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentAccepted}
                      onChange={e => { setConsentAccepted(e.target.checked); if (errors.consent) setErrors(er => ({ ...er, consent: '' })); }}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-purple-600"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      I agree to the{' '}
                      <a href={createPageUrl('PrivacyPolicy')} target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">
                        Privacy Policy
                      </a>{' '}
                      and{' '}
                      <a href={createPageUrl('PrivacyPolicy')} target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">
                        Terms of Service
                      </a>
                    </span>
                  </label>
                  {errors.consent && <p className="text-red-500 text-xs mt-1">{errors.consent}</p>}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'reset' && 'Send Reset Email'}
                  </>
                )}
              </Button>

              {/* Mode switches */}
              {mode === 'reset' ? (
                <button type="button" onClick={() => setMode('login')} className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                  <ArrowLeft className="h-4 w-4" /> Back to Sign In
                </button>
              ) : (
                <p className="text-center text-sm text-gray-500">
                  {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-purple-600 font-semibold hover:underline">
                    {mode === 'login' ? 'Sign up free' : 'Sign in'}
                  </button>
                </p>
              )}
            </form>

            {/* Privacy link */}
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <a href={createPageUrl('PrivacyPolicy')} className="text-xs text-gray-400 hover:text-gray-600 hover:underline">
                Privacy Policy & Terms
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Guest option */}
        <div className="text-center mt-4">
          <a href={createPageUrl('Workout')} className="text-sm text-gray-400 hover:text-gray-600">
            Continue as guest (limited features)
          </a>
        </div>
      </div>
    </div>
  );
}