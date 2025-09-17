import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config'

export const authRouter = express.Router();
const prisma = new PrismaClient();

// --- LOGIN ---
authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, mdp }: { email: string; mdp: string } = req.body;

  const hashedPassword = await bcrypt.hash(mdp, process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10);
  
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const passwordMatch = await bcrypt.compare(mdp, user.mdp);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '24h' });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// --- REGISTER ---
authRouter.post('/register', async (req: Request, res: Response) => {
  const { email, mdp, name }: { email: string; mdp: string; name: string;} = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return res.status(409).json({ message: 'Utilisateur déjà inscrit.' });
    }

    const hashedPassword = await bcrypt.hash(mdp, process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10);

    await prisma.user.create({
      data: { email, mdp: hashedPassword, name },
    });

    res.status(201).json({ message: 'Inscription réussie.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

