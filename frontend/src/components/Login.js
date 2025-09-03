import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap } from 'lucide-react';
import { login } from '../services/api';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await login(email, password);
      
      // Check if it's a first-time login
      if (res.data && res.data.firstTimeLogin) {
        // Redirect to first-time password setup
        navigate('/first-time-login', { state: { email } });
        return;
      }
      
      // Regular login flow
      setUser(res.data);
      // Redirect based on role
      if (res.data && res.data.role) {
        if (res.data.role === 'student') {
          navigate('/student');
        } else if (res.data.role === 'lecturer') {
          navigate('/dashboard');
        } else {
          navigate('/'); // fallback
        }
      } else {
        setError('Login succeeded but no role found.');
      }
    } catch (err) {
      setError(err.response?.data || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-primary">
      <form className="card hover-lift animate-fade-in-up p-8 w-full max-w-md" onSubmit={handleLogin}>
        <h2 className="text-4xl font-bold gradient-text mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label className="block text-text-muted mb-2">Email</label>
          <input
            type="email"
            className="input w-full bg-dark-tertiary border border-gray-600 text-text-primary rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-text-muted mb-2">Password</label>
          <input
            type="password"
            className="input w-full bg-dark-tertiary border border-gray-600 text-text-primary rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password (leave empty for first-time student login)"
          />
        </div>
  {/* Role selection removed. Role is detected by backend. */}
        {error && (
          <p className="text-red-500 mb-4 text-center">
            {typeof error === 'string' ? error : error.error || 'An error occurred'}
          </p>
        )}
        <button type="submit" className="btn btn-primary w-full rounded-xl px-4 py-2 shadow-lg">{loading ? 'Logging in...' : 'Login'}</button>
        
        <div className="mt-4 text-center">
          <p className="text-text-muted text-sm mb-2">
            First time as a student? Enter your email (given by lecturer) and leave password empty.
          </p>
        </div>
        
        <p className="mt-4 text-center text-text-muted">
          Don't have an account? <a href="/register" className="text-primary underline">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
