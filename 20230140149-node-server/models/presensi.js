'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relasi: Presensi belongsTo User
      Presensi.belongsTo(models.User, { 
        foreignKey: 'userId', 
        as: 'user' 
      });
    }
  }
  
  Presensi.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Nama user (denormalized untuk performa)'
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'Waktu check-in'
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Waktu check-out (null jika belum check-out)'
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8), // ✅ Range: -90.00000000 to 90.00000000
      allowNull: true, // ✅ Boleh null jika user tidak memberikan izin lokasi
      defaultValue: 0.0,
      comment: 'Latitude lokasi check-in/check-out'
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8), // ✅ Range: -180.00000000 to 180.00000000
      allowNull: true, // ✅ Boleh null jika user tidak memberikan izin lokasi
      defaultValue: 0.0,
      comment: 'Longitude lokasi check-in/check-out'
    },
    buktiFoto: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Presensi',
    tableName: 'Presensis',
    timestamps: true, // Aktifkan createdAt & updatedAt
    underscored: false, // Gunakan camelCase (bukan snake_case)
  });
  
  return Presensi;
};