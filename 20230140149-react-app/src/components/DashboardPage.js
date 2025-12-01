import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function DashboardPage() {
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [role, setRole] = useState('');
  const [waktu, setWaktu] = useState('');

  useEffect(() => {
    // Cek apakah user sudah login
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Ambil data user dari localStorage
    const storedName = localStorage.getItem('nama') || 'Pengguna';
    const storedRole = localStorage.getItem('role') || 'mahasiswa';
    setNama(storedName);
    setRole(storedRole);

    // Ubah sapaan berdasarkan waktu
    const jam = new Date().getHours();
    if (jam < 12) setWaktu('Selamat Pagi');
    else if (jam < 18) setWaktu('Selamat Siang');
    else setWaktu('Selamat Malam');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="bg-white/90 backdrop-blur-md p-12 rounded-2xl shadow-2xl text-center max-w-xl w-full">
          <h1 className="text-5xl font-extrabold text-pink-600 mb-4">
            {waktu}! 🌤️
          </h1>
          <p className="text-2xl text-gray-800 mb-3">
            Selamat datang, <span className="font-bold text-purple-700">{nama}</span>
          </p>
          <p className="text-lg text-gray-600">
            Role: <span className="font-semibold text-pink-600 uppercase">{role}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;