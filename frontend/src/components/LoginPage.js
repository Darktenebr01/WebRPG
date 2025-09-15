import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

const LoginPage = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.username);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#0f0f10] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <div className="text-white text-sm font-bold">W</div>
            </div>
            <span className="text-white text-xl font-semibold">WebRPG</span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-[#2a2a2a] border-[#404040] p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-white text-xl font-medium">
                {isLogin ? 'Sign in to your account' : 'Create new account'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-white text-sm">Username</label>
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="bg-[#404040] border-[#505050] text-white placeholder-gray-400"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-white text-sm">Email address</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-[#404040] border-[#505050] text-white placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-white text-sm">Password</label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-[#404040] border-[#505050] text-white placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium py-3 rounded-lg transition-all duration-200"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Register')}
              </Button>
            </form>

            {isLogin && (
              <div className="text-center">
                <p className="text-orange-400 text-sm">
                  Forgot Password? Contact us via discord or email us at{' '}
                  <span className="text-orange-300">support@webrpg.com</span>
                </p>
              </div>
            )}

            <div className="text-center pt-4 border-t border-[#404040]">
              <p className="text-gray-400 text-sm">
                {isLogin ? 'New user?' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-orange-400 hover:text-orange-300 font-medium"
                >
                  {isLogin ? 'Register' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;