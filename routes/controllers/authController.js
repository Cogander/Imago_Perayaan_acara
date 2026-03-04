const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "Email sudah terdaftar" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

  const user = new User({
    name,
    email,
    password: hashedPassword,
    verificationToken
  });

  await user.save();

  const verificationLink = `http://localhost:5000/api/auth/verify/${verificationToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verifikasi Email",
    html: `<a href="${verificationLink}">Klik untuk verifikasi akun</a>`
  });

  res.json({ message: "Registrasi berhasil, cek email untuk verifikasi" });
};

exports.verifyEmail = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.send("Email berhasil diverifikasi. Silakan login.");
  } catch {
    res.status(400).send("Token tidak valid");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User tidak ditemukan" });

  if (!user.isVerified) return res.status(400).json({ message: "Email belum diverifikasi" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Password salah" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.json({ token });
};
