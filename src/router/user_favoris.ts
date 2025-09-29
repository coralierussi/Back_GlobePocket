import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { checkToken } from '../middlewares/checkToken';
export const userFavorisRouter = express.Router();

const prisma = new PrismaClient();

// View all favoris
userFavorisRouter.get("/", checkToken, async (req: Request, res: Response) => {
  const userId = req.userId;
  const userFavoris = await prisma.user_Favoris.findMany({
    where: { userId }
  });
  console.log("Favoris de l'utilisateur affichés");
  res.json(userFavoris);
});

// Add a favoris
userFavorisRouter.post("/", checkToken, async (req: Request, res: Response) => {
  const userId = req.userId;
  const { voyageId }: { voyageId: number } = req.body;

  if (typeof userId !== 'number') {
    return res.status(400).json({ error: "Invalid or missing userId" });
  }

  const newFavoris = await prisma.user_Favoris.create({
    data: {
      userId,
      voyageId
    }
  });

  res.status(201).json(newFavoris);
});