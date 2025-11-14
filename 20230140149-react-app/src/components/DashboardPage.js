import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();
  const [nama, setNama] = useState('');
  const [waktu, setWaktu] = useState('');

  useEffect(() => {
    // Ambil nama user dari localStorage (jika disimpan waktu login)
    const storedName = localStorage.getItem('nama') || 'Pengguna';
    setNama(storedName);

    // Ubah sapaan berdasarkan waktu
    const jam = new Date().getHours();
    if (jam < 12) setWaktu('Selamat Pagi');
    else if (jam < 18) setWaktu('Selamat Siang');
    else setWaktu('Selamat Malam');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nama');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 via-blue-200 to-purple-300">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl text-center w-96 transition-transform hover:scale-105 duration-300">
        <h1 className="text-4xl font-extrabold text-green-600 mb-2 animate-bounce">
          {waktu}! 🌤️
        </h1>
        <p className="text-lg text-gray-800 mb-8">
          Selamat datang, <span className="font-semibold text-blue-700">{nama}</span> <br />
          di Halaman Dashboard Anda 🎉
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={handleLogout}
            className="py-2 px-6 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Logout
          </button>

          <button
            onClick={() => alert('Fitur ini belum tersedia 😄')}
            className="py-2 px-6 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Lihat Aktivitas
          </button>
        </div>
      </div>

      <footer className="mt-10 text-gray-700 text-sm opacity-80">
        &copy; {new Date().getFullYear()} Dashboard App — Dibuat dengan 💚 oleh Kamu
      </footer>
    </div>
  );
}

export default DashboardPage;
