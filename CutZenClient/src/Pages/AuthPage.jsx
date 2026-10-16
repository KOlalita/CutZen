import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { Scissors, UserPlus, LogIn, Eye, EyeOff, AlertCircle, XCircle, ServerCrash } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // ← ahora es un objeto con tipo y mensaje

  const [form, setForm] = useState({
    userName: '',
    password: '',
    confirmPassword: '',
    names: '',
    lastNames: '',
    age: '',
    phoneNumber: '',
  });

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  // Función para interpretar errores del backend
  const parseError = (err) => {
    const message = err.message || '';
    
    // Error de red / servidor caído
    if (!err.response && !message.includes('HTTP')) {
      return {
        type: 'network',
        title: 'Connection error',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        icon: <ServerCrash className="h-5 w-5" />,
        color: 'orange',
      };
    }

    // Error HTTP 500
    if (message.includes('500') || message.includes('Internal Server Error')) {
      return {
        type: 'server',
        title: 'Wrong Data',
        message: 'Data provided is incorrect. Please check your information and try again.',
        icon: <ServerCrash className="h-5 w-5" />,
        color: 'red',
      };
    }

    // Error HTTP 401 / credenciales incorrectas
    if (message.includes('401') || message.includes('Unauthorized') || message.includes('Invalid credentials')) {
      return {
        type: 'auth',
        title: 'Invalid credentials',
        message: 'The username or password you entered is incorrect. Please try again.',
        icon: <XCircle className="h-5 w-5" />,
        color: 'red',
      };
    }

    // Error HTTP 400 / datos inválidos
    if (message.includes('400') || message.includes('Bad Request')) {
      return {
        type: 'validation',
        title: 'Invalid data',
        message: 'Please check your information and try again.',
        icon: <AlertCircle className="h-5 w-5" />,
        color: 'amber',
      };
    }

    // Error HTTP 409 / usuario ya existe (registro)
    if (message.includes('409') || message.includes('Conflict') || message.includes('already exists')) {
      return {
        type: 'conflict',
        title: 'Account already exists',
        message: 'This username is already taken. Please choose a different one.',
        icon: <AlertCircle className="h-5 w-5" />,
        color: 'amber',
      };
    }

    // Error genérico
    return {
      type: 'unknown',
      title: 'Error',
      message: message || 'An unexpected error occurred. Please try again.',
      icon: <AlertCircle className="h-5 w-5" />,
      color: 'red',
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let response;

      if (isLogin) {
        response = await authApi.login(form.userName, form.password);
      } else {
        if (form.password !== form.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        response = await authApi.register({
          userName: form.userName,
          password: form.password,
          names: form.names,
          lastNames: form.lastNames,
          age: parseInt(form.age) || null,
          phoneNumber: form.phoneNumber,
        });
      }

      localStorage.setItem('jwt_token', response.token);
      localStorage.setItem('user_role', response.role);
      localStorage.setItem('user_name', response.userName);

      const role = response.role.toLowerCase();
      if (role === 'client') navigate('/dashboard');
      else if (role === 'barber') navigate('/barber');
      else if (role === 'admin') navigate('/admin');
      else navigate('/dashboard');

    } catch (err) {
      setError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  // Configuración de colores según tipo de error
  const errorStyles = {
    red: 'bg-red-50 border-red-200 text-red-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
  };

  return (
    <div className="min-h-screen bg-[#f7f3ee] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5d4037] to-[#a1887f] text-white shadow-lg mb-4">
            <Scissors className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900">CutZen</h1>
          <p className="text-stone-500 mt-1">{isLogin ? 'Welcome back' : 'Create your account'}</p>
        </div>

        {/* Toggle */}
        <div className="flex rounded-xl bg-stone-200/50 p-1 mb-6">
          <button
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              isLogin ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <LogIn className="h-4 w-4" /> Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              !isLogin ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <UserPlus className="h-4 w-4" /> Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Banner */}
          {error && (
            <div className={`rounded-xl border p-4 ${errorStyles[error.color] || errorStyles.red}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">{error.icon}</div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold">{error.title}</h4>
                  <p className="mt-0.5 text-sm leading-relaxed">{error.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="shrink-0 rounded-lg p-1 hover:bg-black/5 transition-colors"
                >
                  <XCircle className="h-4 w-4 opacity-60" />
                </button>
              </div>
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Username</label>
            <input
              type="text"
              value={form.userName}
              onChange={(e) => update('userName', e.target.value)}
              required
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
              placeholder="Enter your username"
            />
          </div>

          {/* Register fields */}
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={form.names}
                    onChange={(e) => update('names', e.target.value)}
                    required
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={form.lastNames}
                    onChange={(e) => update('lastNames', e.target.value)}
                    required
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Age</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={form.age}
                    onChange={(e) => update('age', e.target.value)}
                    min="1"
                    max="120"
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={form.phoneNumber}
                    onChange={(e) => {
                    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                    update('phoneNumber', onlyNums);
                    }}
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
            </>
          )}

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              required
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-stone-400 hover:text-stone-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Confirm Password */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => update('confirmPassword', e.target.value)}
                required
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                placeholder="••••••••"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-[#5d4037] via-[#795548] to-[#a1887f] py-4 text-sm font-bold text-white shadow-lg shadow-amber-900/20 transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Please wait...
              </span>
            ) : isLogin ? (
              'Login'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Switch mode link */}
        {isLogin && (
          <p className="mt-4 text-center text-sm text-stone-500">
            Don't have an account?{' '}
            <button 
              onClick={() => { setIsLogin(false); setError(null); }} 
              className="font-semibold text-amber-700 hover:text-amber-800 transition-colors"
            >
              Register as Client
            </button>
          </p>
        )}
      </div>
    </div>
  );
}