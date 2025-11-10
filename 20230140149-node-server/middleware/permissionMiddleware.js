const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN'; // pastikan sama seperti di authController

exports.addUserData = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ambil data user dari database sesuai id di token
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Simpan data user ke request
    req.user = {
      id: user.id,
      nama: user.nama,
      role: user.role
    };

    console.log(`Middleware: Data user (${user.nama}, role: ${user.role}) ditambahkan.`);
    next();
  } catch (error) {
    console.error('Middleware Error:', error.message);
    return res.status(401).json({ message: 'Token tidak valid', error: error.message });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    console.log('Middleware: Izin admin diberikan.');
    next();
  } else {
    console.log('Middleware: Gagal! Pengguna bukan admin.');
    return res.status(403).json({ message: 'Akses ditolak: Hanya untuk admin' });
  }
};
