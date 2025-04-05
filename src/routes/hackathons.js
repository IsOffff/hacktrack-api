const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const hackathons = await prisma.hackathon.findMany();
  res.json(hackathons);
});

router.post('/', async (req, res) => {
  const { title, description, date } = req.body;

  try {
    const newHackathon = await prisma.hackathon.create({
      data: {
        title,
        description,
        date: new Date(date),
      },
    });

    res.status(201).json(newHackathon);
  } catch (error) {
    console.error('Error creating hackathon:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
