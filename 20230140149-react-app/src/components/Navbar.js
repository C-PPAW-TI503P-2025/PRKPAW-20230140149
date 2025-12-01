import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ nama: '', role: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Ambil token dari localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // Decode token untuk mendapatkan data user
        const decoded = jwtDecode(token);
        setUser({
          nama: decoded.nama || 'Pengguna',
          role: decoded.role || 'mahasiswa'
        });
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [location]);

  const handleLogout = () => {
    // Hapus semua data dari localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('nama');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    
    // Navigasi ke halaman login
    navigate('/login');
  };

  // Helper untuk cek active link
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <Link 
              to={isLoggedIn ? "/dashboard" : "/login"}
              className="text-white text-xl font-bold hover:text-gray-200 transition-colors"
            >
              📱 Dashboard App
            </Link>
          </div>

          {/* Menu Navigation */}
          <div className="flex items-center space-x-6">
            {!isLoggedIn ? (
              // Menu untuk user yang belum login
              <>
                <Link
                  to="/login"
                  className={`text-white font-semibold hover:text-gray-200 transition-colors px-3 py-2 rounded-md ${
                    isActive('/login') ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  🔑 Login
                </Link>
                <Link
                  to="/register"
                  className={`text-white font-semibold hover:text-gray-200 transition-colors px-3 py-2 rounded-md ${
                    isActive('/register') ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  📝 Register
                </Link>
              </>
            ) : (
              // Menu untuk user yang sudah login
              <>
                <Link
                  to="/dashboard"
                  className={`text-white font-semibold hover:text-gray-200 transition-colors px-3 py-2 rounded-md ${
                    isActive('/dashboard') ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  🏠 Dashboard
                </Link>

                <Link
                  to="/attendance"
                  className={`text-white font-semibold hover:text-gray-200 transition-colors px-3 py-2 rounded-md ${
                    isActive('/attendance') ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  ✅ Presensi
                </Link>

                {/* Menu Laporan - tampil untuk semua user yang login */}
                <Link
                  to="/laporan-admin"
                  className={`text-white font-semibold hover:text-gray-200 transition-colors px-3 py-2 rounded-md ${
                    isActive('/laporan-admin') ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  📊 Laporan Presensi
                </Link>

                {/* Nama User */}
                <div className="text-white font-medium border-l border-white/30 pl-6">
                  👤 {user.nama}
                  <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full uppercase">
                    {user.role}
                  </span>
                </div>

                {/* Tombol Logout */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;