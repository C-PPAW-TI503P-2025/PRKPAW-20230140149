import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

// =========================================================
// 1. WAJIB: Import CSS Leaflet agar peta tidak pecah-pecah
// =========================================================
import 'leaflet/dist/leaflet.css';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// =========================================================
// 2. FIX: Agar icon marker (pin biru) muncul dengan benar
// =========================================================
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function AttendancePage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [coords, setCoords] = useState(null); // Lokasi user: {lat, lng}
  const mapRef = useRef(null);

  // Ambil token dari localStorage
  const getToken = () => localStorage.getItem('token');

  // Ambil lokasi GPS
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          setError("Gagal mengambil lokasi: " + err.message);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    } else {
      setError("Browser tidak mendukung geolocation.");
    }
  };

  // Ambil lokasi ketika page dibuka
  useEffect(() => {
    getLocation();
  }, []);

  // Saat coords berubah, atur view map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !coords) return;

    try {
      // Gunakan flyTo agar gerakannya lebih smooth
      map.flyTo([coords.lat, coords.lng], 16);
    } catch (e) {
      // ignore error jika map belum siap
    }
  }, [coords]);

  // ========================= CHECK IN =========================
  const handleCheckIn = async () => {
    setError('');
    setMessage('');

    if (!coords) {
      setError("Lokasi belum didapatkan. Izinkan akses lokasi.");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const response = await axios.post(
        'http://localhost:3001/api/presensi/check-in',
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        config
      );

      setMessage(response.data.message || 'Check-in berhasil!');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Check-in gagal');
    }
  };

  // ========================= CHECK OUT =========================
  const handleCheckOut = async () => {
    setError('');
    setMessage('');

    if (!coords) {
      setError("Lokasi belum didapatkan. Izinkan akses lokasi.");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const response = await axios.post(
        'http://localhost:3001/api/presensi/check-out',
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        config
      );

      setMessage(response.data.message || 'Check-out berhasil!');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Check-out gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200">
      <Navbar />

      <div className="flex flex-col items-center justify-center py-10 px-4">
        {/* CARD PRESENSI */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center mb-6">
          <div className="text-6xl mb-4">📍</div>
          <h2 className="text-3xl font-bold mb-6 text-pink-600">Lakukan Presensi</h2>

          <p className="text-gray-600 mb-6">
            Pastikan lokasi hidup sebelum melakukan presensi.
          </p>

          {/* MESSAGE */}
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 font-semibold">
              ✅ {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 font-semibold">
              ❌ {error}
            </div>
          )}

          {/* BUTTON CHECK-IN & CHECK-OUT */}
          <div className="flex space-x-4">
            <button
              onClick={handleCheckIn}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-500 hover:to-green-700 transition-all"
            >
              ✅ Check-In
            </button>

            <button
              onClick={handleCheckOut}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold rounded-lg shadow-md hover:from-red-500 hover:to-red-700 transition-all"
            >
              🚪 Check-Out
            </button>
          </div>

          {/* Informasi koordinat kecil */}
          {coords && (
            <div className="mt-4 text-sm text-gray-600">
              Koordinat: {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
            </div>
          )}
        </div>

        {/* MAP SECTION */}
        <div className="w-full max-w-md bg-white p-4 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold mb-3 text-pink-600">Lokasi Anda</h3>

          <div style={{ height: 360, width: '100%', overflow: 'hidden', borderRadius: '0.5rem' }}>
            {!coords ? (
              <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-500">
                <p>Mengambil lokasi...</p>
              </div>
            ) : (
              <MapContainer
                // Jika error "whenCreated is not a function", ganti baris bawah ini dengan: ref={mapRef}
                whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
                center={[coords.lat, coords.lng]}
                zoom={16}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer 
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                />
                <Marker position={[coords.lat, coords.lng]}>
                  <Popup>Anda berada di sini</Popup>
                </Marker>
              </MapContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;