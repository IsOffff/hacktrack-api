const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

router.post('/', authenticate, async (req, res) => {
  const { name, hackathonId } = req.body;

  if (!name || !hackathonId) {
    return res.status(400).json({ message: 'Missing name or hackathonId' });
  }

  try {
    const team = await prisma.team.create({
      data: {
        name,
        hackathon: { connect: { id: hackathonId } },
        members: { connect: { id: req.userId } },
      },
    });

    res.status(201).json(team);
  } catch (err) {
    console.error('Erreur création équipe :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/:teamId/join', authenticate, async (req, res) => {
  const teamId = parseInt(req.params.teamId);
  const userId = req.userId;

  try {

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { hackathon: { include: { teams: { include: { members: true } } } } }
    });

    const alreadyIn = team.hackathon.teams.some((t) =>
      t.members.some((m) => m.id === userId)
    );

    if (alreadyIn) {
      return res.status(400).json({ message: "Tu fais déjà partie d'une équipe" });
    }

    await prisma.team.update({
      where: { id: teamId },
      data: {
        members: { connect: { id: userId } }
      }
    });

    res.json({ message: 'Rejoint avec succès ✅' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'ajout dans l'équipe" });
  }
});


module.exports = router;
