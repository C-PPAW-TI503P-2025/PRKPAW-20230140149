'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      console.log('🔄 Menambahkan kolom lokasi ke tabel Presensis...');
      
      // Cek apakah tabel Presensis ada
      const tableDescription = await queryInterface.describeTable('Presensis');
      
      // Tambahkan kolom latitude jika belum ada
      if (!tableDescription.latitude) {
        await queryInterface.addColumn('Presensis', 'latitude', {
          type: Sequelize.DECIMAL(10, 8), // ✅ Presisi yang benar untuk latitude
          allowNull: true,
          defaultValue: 0.0,
          comment: 'Latitude lokasi check-in/check-out'
        });
        console.log('✅ Kolom latitude berhasil ditambahkan');
      } else {
        console.log('⚠️ Kolom latitude sudah ada, skip');
      }
      
      // Tambahkan kolom longitude jika belum ada
      if (!tableDescription.longitude) {
        await queryInterface.addColumn('Presensis', 'longitude', {
          type: Sequelize.DECIMAL(11, 8), // ✅ Presisi yang benar untuk longitude
          allowNull: true,
          defaultValue: 0.0,
          comment: 'Longitude lokasi check-in/check-out'
        });
        console.log('✅ Kolom longitude berhasil ditambahkan');
      } else {
        console.log('⚠️ Kolom longitude sudah ada, skip');
      }

      console.log('🎉 Migration selesai!');

    } catch (error) {
      console.error('❌ Error saat menambahkan kolom lokasi:', error.message);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      console.log('🔄 Menghapus kolom lokasi dari tabel Presensis...');

      // Hapus kolom latitude
      await queryInterface.removeColumn('Presensis', 'latitude');
      console.log('✅ Kolom latitude berhasil dihapus');

      // Hapus kolom longitude
      await queryInterface.removeColumn('Presensis', 'longitude');
      console.log('✅ Kolom longitude berhasil dihapus');

      console.log('🎉 Rollback selesai!');

    } catch (error) {
      console.error('❌ Error saat menghapus kolom lokasi:', error.message);
      throw error;
    }
  }
};