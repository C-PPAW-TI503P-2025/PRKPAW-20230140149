import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReports = async (query) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          tanggalMulai: '2020-01-01', // Tanggal mulai yang lama untuk ambil semua data
          tanggalSelesai: new Date().toISOString().split('T')[0], // Hari ini
          ...(query && { nama: query }) // Tambahkan filter nama jika ada
        }
      };

      const response = await axios.get('http://localhost:3001/api/reports/daily', config);
      
      // 🔍 DEBUG: Log response
      console.log('=== DEBUG RESPONSE ===');
      console.log('Response data:', response.data);
      if (response.data.data && response.data.data.length > 0) {
        console.log('Sample first item:', response.data.data[0]);
      }
      
      setReports(response.data.data || response.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengambil data laporan');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports('');
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-4xl font-bold text-pink-600 mb-2">
            Laporan Presensi Harian
          </h1>
          <p className="text-gray-600">
            Data presensi check-in dan check-out seluruh pengguna
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <form onSubmit={handleSearchSubmit} className="flex space-x-2">
            <input
              type="text"
              placeholder="🔍 Cari berdasarkan nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-4 py-3 border border-pink-300 rounded-lg shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            />
            <button
              type="submit"
              className="py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:from-pink-600 hover:to-purple-600 transition-all focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              Cari
            </button>
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  fetchReports('');
                }}
                className="py-3 px-6 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition-all"
              >
                Reset
              </button>
            )}
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
            <p className="font-semibold">❌ {error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
            <p className="text-gray-600 font-semibold">Memuat data...</p>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <table className="min-w-full divide-y divide-pink-200">
              <thead className="bg-gradient-to-r from-pink-500 to-purple-500">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    👤 Nama
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    ✅ Check-In
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    🚪 Check-Out
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-pink-100">
                {reports.length > 0 ? (
                  reports.map((presensi, index) => (
                    <tr 
                      key={presensi.id} 
                      className={`hover:bg-pink-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-pink-50/30'
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {presensi.user ? presensi.user.nama : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {presensi.checkIn
                            ? new Date(presensi.checkIn).toLocaleString('id-ID', {
                                timeZone: 'Asia/Jakarta',
                              })
                            : <span className="text-gray-400">N/A</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {presensi.checkOut ? (
                          <div className="text-sm text-gray-700">
                            {new Date(presensi.checkOut).toLocaleString('id-ID', {
                              timeZone: 'Asia/Jakarta',
                            })}
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                            ⏳ Belum Check-Out
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-12 text-center"
                    >
                      <div className="text-gray-400 text-5xl mb-4">📭</div>
                      <p className="text-gray-500 font-semibold">
                        {searchTerm 
                          ? `Tidak ada data untuk pencarian "${searchTerm}"`
                          : 'Tidak ada data presensi yang tersedia.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportPage;