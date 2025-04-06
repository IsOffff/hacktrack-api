const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 5;

  try {
    const hackathons = await prisma.hackathon.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { date: 'asc' },
    });

    const totalCount = await prisma.hackathon.count();
    res.json({
      hackathons,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / pageSize),
    });
  } catch (err) {
    console.error('Erreur pagination hackathons :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
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

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const hackathon = await prisma.hackathon.findUnique({
      where: { id },
      include: {
        teams: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!hackathon) {
      return res.status(404).json({ message: 'Hackathon not found' });
    }

    res.json(hackathon);
  } catch (error) {
    console.error('Erreur GET /hackathons/:id', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
