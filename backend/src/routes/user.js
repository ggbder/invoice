// backend/routes/user.js
const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Create a new user (admin only)
router.post('/users', async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash: hashedPassword,
        role,
        isVerified: false,
      },
    });
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

module.exports = router;