import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap } from 'lucide-react';
import { register } from '../services/api';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(email, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-primary">
      <form className="card hover-lift animate-fade-in-up p-8 w-full max-w-md" onSubmit={handleRegister}>
        <h2 className="text-4xl font-bold gradient-text mb-6 text-center">Register</h2>
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
            required
          />
        </div>
  {/* Role selection removed. Only lecturers should use this registration. */}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">Registered! Redirecting to login...</p>}
        <button type="submit" className="btn btn-primary w-full rounded-xl px-4 py-2 shadow-lg">{loading ? 'Registering...' : 'Register'}</button>
        <p className="mt-4 text-center text-text-muted">
          Already have an account? <a href="/login" className="text-primary underline">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
