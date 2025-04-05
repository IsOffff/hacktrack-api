const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { name, hackathonId, memberIds } = req.body;
  const team = await prisma.team.create({
    data: {
      name,
      hackathonId,
      members: { connect: memberIds.map((id) => ({ id })) },
    },
  });
  res.json(team);
});

module.exports = router;