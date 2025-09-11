import express, { Request, Response } from 'express';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const REMOTE_API_URL = 'https://globe-pocket-back.onrender.com/api/login';

// --- LOGIN ---
router.post('/login', async (req: Request, res: Response) => {
  const { email, mdp }: { email: string; mdp: string } = req.body;

  try {
    const apiResponse = await fetch(REMOTE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, mdp }),
    });

    if (!apiResponse.ok) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const result = await apiResponse.json();

    // Facultatif : générer un token local
    const token = jwt.sign({ email }, 'SECRET_KEY');

    res.json({ token, user: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// --- REGISTER ---
router.post('/register', async (req: Request, res: Response) => {
  const { email, mdp, name, sexe }: { email: string; mdp: string; name: string; sexe: 'Homme' | 'Femme' | 'Autre' } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return res.status(409).json({ message: 'Utilisateur déjà inscrit.' });
    }

    await prisma.user.create({
      data: { email, mdp, name, sexe: 'Autre' },
    });

    res.status(201).json({ message: 'Inscription réussie.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
