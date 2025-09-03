import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setupPassword } from '../services/api';

const FirstTimeLogin = ({ setUser }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from the location state (passed from Login component)
  const email = location.state?.email || '';

  const handleSetupPassword = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError('Both password fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await setupPassword(email, password);
      if (res.data && res.data.user) {
        setUser(res.data.user);
        navigate('/student'); // Redirect to student dashboard
      }
    } catch (err) {
      setError(err.response?.data || 'Password setup failed');
    } finally {
      setLoading(false);
    }
  };

  // If no email is provided, redirect to login
  if (!email) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark-primary">
      <form className="card hover-lift animate-fade-in-up p-8 w-full max-w-md" onSubmit={handleSetupPassword}>
        <h2 className="text-4xl font-bold gradient-text mb-6 text-center">Set Your Password</h2>
        
        <div className="mb-4">
          <p className="text-text-muted mb-4 text-center">
            Welcome! This is your first time logging in with email: <strong className="text-primary">{email}</strong>
          </p>
          <p className="text-text-muted mb-6 text-center text-sm">
            Please create a secure password for your account.
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block text-text-muted mb-2">New Password</label>
          <input
            type="password"
            className="input w-full bg-dark-tertiary border border-gray-600 text-text-primary rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your new password"
            required
            minLength="6"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-text-muted mb-2">Confirm Password</label>
          <input
            type="password"
            className="input w-full bg-dark-tertiary border border-gray-600 text-text-primary rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            required
            minLength="6"
          />
        </div>
        
        {error && (
          <p className="text-red-500 mb-4 text-center">
            {typeof error === 'string' ? error : error.error || 'An error occurred'}
          </p>
        )}
        
        <button 
          type="submit" 
          className="btn btn-primary w-full rounded-xl px-4 py-2 shadow-lg"
          disabled={loading}
        >
          {loading ? 'Setting Password...' : 'Set Password'}
        </button>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-text-muted hover:text-primary underline"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default FirstTimeLogin;
