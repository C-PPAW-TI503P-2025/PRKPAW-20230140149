// controllers/presensiController.js
const { Presensi, User } = require('../models');
const { Op } = require('sequelize');

// helper: cek apakah value bisa dianggap sebagai koordinat valid (opsional sederhana)
const isValidCoordinate = (v) => {
  if (v === undefined || v === null) return false;
  const n = Number(v);
  return Number.isFinite(n) && Math.abs(n) <= 180;
};

// ===========================
// POST /api/presensi/check-in
// ===========================
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    console.log('=== CHECK-IN REQUEST ===');
    console.log('User ID:', userId, 'Body:', { latitude, longitude });

    // ambil user untuk nama
    const userData = await User.findByPk(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'Data user tidak ditemukan di database.'
      });
    }
    const userName = userData.nama || null;

    const presensiAktif = await Presensi.findOne({
      where: {
        userId,
        checkIn: { [Op.ne]: null },
        checkOut: null
      }
    });

    if (presensiAktif) {
      return res.status(400).json({
        success: false,
        message: 'Anda masih dalam status presensi. Silakan check-out dulu.'
      });
    }

    // siapkan nilai latitude & longitude — simpan null jika tidak valid/ tidak dikirim
    const lat = isValidCoordinate(latitude) ? Number(latitude) : null;
    const lng = isValidCoordinate(longitude) ? Number(longitude) : null;

    // buat presensi baru (sekali saja)
    const newPresensi = await Presensi.create({
      userId,
      nama: userName,
      tanggal: new Date(),   // <- tambahkan ini
      checkIn: new Date(),
      latitude: lat,
      longitude: lng
    });



    console.log('Check-in berhasil - Presensi ID:', newPresensi.id);

    return res.status(201).json({
      success: true,
      message: 'Check-in berhasil!',
      data: {
        id: newPresensi.id,
        userId: newPresensi.userId,
        nama: newPresensi.nama,
        checkIn: newPresensi.checkIn,
        latitude: newPresensi.latitude,
        longitude: newPresensi.longitude
      }
    });
  } catch (error) {
    console.error('Error check-in:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal melakukan check-in (Server Error)',
      error: error.message
    });
  }
};

// ============================
// POST /api/presensi/check-out
// ============================
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    console.log('=== CHECK-OUT REQUEST ===');
    console.log('User ID:', userId, 'Body:', { latitude, longitude });

    // cari presensi hari ini yang belum check-out
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const presensi = await Presensi.findOne({
      where: {
        userId,
        checkIn: { [Op.gte]: today, [Op.lt]: tomorrow },
        checkOut: null
      }
    });

    if (!presensi) {
      return res.status(400).json({
        success: false,
        message: 'Anda belum check-in hari ini atau sudah melakukan check-out sebelumnya.'
      });
    }

    // update waktu check-out
    presensi.checkOut = new Date();

    // update lokasi jika valid dikirim
    if (isValidCoordinate(latitude)) presensi.latitude = Number(latitude);
    if (isValidCoordinate(longitude)) presensi.longitude = Number(longitude);

    await presensi.save();

    console.log('Check-out berhasil - Presensi ID:', presensi.id);

    return res.json({
      success: true,
      message: 'Check-out berhasil!',
      data: {
        id: presensi.id,
        userId: presensi.userId,
        nama: presensi.nama,
        checkIn: presensi.checkIn,
        checkOut: presensi.checkOut,
        latitude: presensi.latitude,
        longitude: presensi.longitude
      }
    });
  } catch (error) {
    console.error('Error check-out:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal melakukan check-out',
      error: error.message
    });
  }
};

// ============================
// DELETE /api/presensi/:id (admin)
// ============================
exports.deletePresensi = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    console.log('=== DELETE PRESENSI ===', { id, userRole });

    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Hanya admin yang dapat menghapus data presensi'
      });
    }

    const presensi = await Presensi.findByPk(id);
    if (!presensi) {
      return res.status(404).json({
        success: false,
        message: 'Data presensi tidak ditemukan'
      });
    }

    await presensi.destroy();

    console.log('Presensi berhasil dihapus:', id);
    return res.json({ success: true, message: 'Data presensi berhasil dihapus' });
  } catch (error) {
    console.error('Error delete presensi:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal menghapus data presensi',
      error: error.message
    });
  }
};

// ============================
// PUT /api/presensi/:id (admin)
// ============================
exports.updatePresensi = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut, latitude, longitude } = req.body;
    const userRole = req.user.role;

    console.log('=== UPDATE PRESENSI ===', { id, userRole, body: req.body });

    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Hanya admin yang dapat mengupdate data presensi'
      });
    }

    const presensi = await Presensi.findByPk(id);
    if (!presensi) {
      return res.status(404).json({
        success: false,
        message: 'Data presensi tidak ditemukan'
      });
    }

    if (checkIn) presensi.checkIn = new Date(checkIn);
    if (checkOut) presensi.checkOut = new Date(checkOut);
    if (isValidCoordinate(latitude)) presensi.latitude = Number(latitude);
    if (isValidCoordinate(longitude)) presensi.longitude = Number(longitude);

    await presensi.save();

    console.log('Presensi berhasil diupdate:', id);
    return res.json({ success: true, message: 'Data presensi berhasil diupdate', data: presensi });
  } catch (error) {
    console.error('Error update presensi:', error);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengupdate data presensi',
      error: error.message
    });
  }
};

// alias compatibility
exports.CheckIn = exports.checkIn;
exports.CheckOut = exports.checkOut;