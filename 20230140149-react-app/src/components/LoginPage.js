import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from './Navbar';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); 

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email: email,
        password: password
      });

      const token = response.data.token;
      
      // Decode token untuk ambil data user
      const decoded = jwtDecode(token);
      console.log('Data dari token:', decoded);
      
      // Simpan token dan data user
      localStorage.setItem('token', token);
      localStorage.setItem('nama', decoded.nama);
      localStorage.setItem('role', decoded.role);
      localStorage.setItem('userId', decoded.id);

      navigate('/dashboard');

    } catch (err) {
      setError(err.response ? err.response.data.message : 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200">
      <Navbar />
      
      <div className="flex items-center justify-center py-20 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-pink-600">
            🔐 Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700"
              >
                Email:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 border border-pink-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                placeholder="contoh@email.com"
              />
            </div>
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700"
              >
                Password:
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 border border-pink-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                placeholder="Masukkan password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-md shadow-md hover:from-pink-600 hover:to-purple-600 transition-all focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              Login
            </button>
          </form>
          {error && (
            <p className="text-red-600 bg-red-50 p-3 rounded-md text-sm mt-4 text-center">{error}</p>
          )}
          
          <p className="mt-6 text-center text-gray-600 text-sm">
            Belum punya akun?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="text-pink-600 font-semibold hover:underline"
            >
              Register di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;