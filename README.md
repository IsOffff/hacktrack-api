
 Bienvenue sur le backend de HackTrack, une API permettant de gérer des hackathons, les utilisateurs, les équipes.
 
 Technologies utilisées

- Node.js
- Express
- Prisma
- PostgreSQL
- JWT (JSON Web Token)
-----------------------------------------
Routes principales

POST /auth/register = inscription

POST /auth/login = connexion

GET /hackathons = liste des hackathons

POST /hackathons = créer un hackathon

GET /hackathons/:id = détails d’un hackathon
