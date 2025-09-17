import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, Type } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config'
import { checkToken } from '../middlewares/checkToken';

export const voyagesRouter = express.Router();
const prisma = new PrismaClient();

voyagesRouter.post('/', async (req: Request, res: Response) => {
    const { destination, date_depart, date_retour, prix, type }: { destination: string; date_depart: Date; date_retour: Date; prix: number; type: Type } = req.body;
    const voyage = await prisma.voyage.create({
        data: {
            destination,
            date_depart,
            date_retour,
            prix,
            type
        }
    });
    res.status(201).json(voyage);
});

voyagesRouter.get('/', async (req: Request, res: Response) => {
  const voyages = await prisma.voyage.findMany();
  res.json(voyages);
});


voyagesRouter.get('/user', checkToken, async (req: Request, res: Response) => {
  const voyages = await prisma.voyage.findMany({
    where: {
        participants: {
            some: { id: req.userId }
        }
    }
  });
  res.json(voyages);
});
