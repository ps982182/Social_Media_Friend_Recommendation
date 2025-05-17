// backend/routes/user.js
const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload/:id', upload.single('profilePic'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { profilePic: req.file.filename }, // Only filename!
    { new: true }
  );
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ profilePic: user.profilePic });
});

module.exports = router;
