const { Presensi, User } = require('../models');
const { Op } = require('sequelize'); 
const { validationResult } = require('express-validator');

exports.getDailyReport = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Query parameter tidak valid",
      errors: errors.array(),
    });
  }

  try {
    const { tanggalMulai, tanggalSelesai, nama } = req.query;

    const startDate = new Date(tanggalMulai);
    startDate.setHours(0, 0, 0, 0); 

    const endDate = new Date(tanggalSelesai);
    endDate.setHours(23, 59, 59, 999);

    const whereClause = {
      checkIn: {
        [Op.between]: [startDate, endDate]
      }
    };

    // ✅ HARDCODE include untuk testing
    const queryOptions = {
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'nama', 'email'],
        required: false // ✅ LEFT JOIN (tetap tampilkan presensi meskipun user null)
      }],
      order: [['checkIn', 'ASC']]
    };

    // ✅ Jika ada filter nama, tambahkan where di include
    if (nama) {
      queryOptions.include[0].where = {
        nama: {
          [Op.like]: `%${nama}%`
        }
      };
      queryOptions.include[0].required = true; // ✅ INNER JOIN jika ada filter nama
    }

    const reports = await Presensi.findAll(queryOptions);

    // 🔍 DEBUG
    console.log('=== DEBUG REPORTS ===');
    console.log('Total reports:', reports.length);
    if (reports.length > 0) {
      const sample = reports[0].toJSON(); // Convert Sequelize instance ke plain object
      console.log('Sample first report:', JSON.stringify(sample, null, 2));
    }

    if (reports.length === 0) {
      return res.status(404).json({
        message: 'Tidak ada data presensi ditemukan pada rentang tanggal dan filter nama tersebut.',
      });
    }

    res.status(200).json({
      message: `Menampilkan ${reports.length} data laporan`,
      data: reports,
    });

  } catch (error) {
    console.error('❌ Error di getDailyReport:', error);
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};