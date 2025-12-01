// ✅ TAMBAHAN WAJIB: Biar bisa baca process.env.JWT_SECRET dari file .env
require('dotenv').config(); 

const jwt = require("jsonwebtoken");
// Pastikan nama variabel ENV-nya sama persis dengan yang ada di file .env kamu
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here"; 

// Middleware untuk autentikasi token
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("=== AUTHENTICATE TOKEN ===");
  // console.log("Auth Header:", authHeader); // Boleh dikomen biar log ga penuh
  console.log("Token:", token ? "Token Ada" : "Token Kosong");

  if (token == null) {
    return res
      .status(401)
      .json({ message: "Akses ditolak. Token tidak disediakan." });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      console.error("JWT Verify Error:", err.message);
      return res
        .status(403)
        .json({ message: "Token tidak valid atau kedaluwarsa." });
    }
    
    // console.log("User Payload:", userPayload);
    req.user = userPayload;
    next();
  });
};

// Middleware untuk menambahkan data user (alias untuk authenticateToken)
exports.addUserData = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("=== ADD USER DATA ===");
  console.log("JWT_SECRET Loaded:", JWT_SECRET !== "your-secret-key-here"); // Cek apakah secret asli termuat

  if (token == null) {
    return res
      .status(401)
      .json({ message: "Akses ditolak. Token tidak disediakan." });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      console.error("JWT Verify Error:", err.message);
      // Jangan tampilkan secret di log production demi keamanan, tapi untuk debug ok
      // console.error("Secret mismatch?"); 
      return res
        .status(403)
        .json({ message: "Token tidak valid atau kedaluwarsa." });
    }
    
    console.log("User Payload berhasil decode:", userPayload.role); // Cek role yang masuk
    req.user = userPayload;
    next();
  });
};

// Middleware 'isAdmin' memeriksa 'role' dari token
exports.isAdmin = (req, res, next) => {
  console.log("=== CHECK ADMIN ===");
  // console.log("Role:", req.user?.role);

  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Akses ditolak. Hanya untuk admin." });
  }
};