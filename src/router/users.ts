import express, { Request, Response } from 'express';
import { PrismaClient, Sexe } from '@prisma/client';
import { checkToken } from '../middlewares/checkToken';
export const userRouter = express.Router();

const prisma = new PrismaClient();

// View all users
userRouter.get("/", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  console.log("getting users");
  res.json(users);
});

// Update user info
userRouter.put('/', checkToken, async (req: Request, res: Response) => {
  const userId = req.userId;
  const {
          name,
          email,
          mdp,
          pseudo,
          ville,
          pays,
          date_anniversaire,
          sexe,
          galerie,
          documents,
          description,
          cp,
          compte_bancaire
        }: {
          name: string;
          email: string;
          mdp: string;
          pseudo: string;
          ville: string;
          pays: string;
          date_anniversaire: Date;
          sexe: Sexe;
          galerie: string[];
          documents: string[];
          description: string;
          cp: number;
          compte_bancaire: number;
        } = req.body;
  const param = await prisma.user.update({
    where: { id: userId },
    select: { id: true, 
      name: true, 
      email: true, 
      mdp: true, 
      pseudo: true, 
      ville: true, 
      pays: true, 
      date_anniversaire: true, 
      sexe: true, 
      galerie: true, 
      documents: true, 
      description: true, 
      cp: true, 
      compte_bancaire: true 
    },
    data: {
      name,
      email,
      mdp,
      pseudo,
      ville,
      pays,
      date_anniversaire,
      sexe,
      galerie,
      documents,
      description,
      cp,
      compte_bancaire
    }
  });
  res.json(param)
});


userRouter.get('/:userid/photos', async (req: Request, res: Response) => {
  const userId = req.params.userid;
  const param = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    select: { galerie: true }
  });
  res.json(param)
})

userRouter.put('/photos', checkToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  const { galerie }: { galerie: string[] } = req.body;
  const param = await prisma.user.update({
    where: { id: userId },
    select: { galerie: true },
    data: { galerie }
  });
  res.json(param)
})

userRouter.get('/:userid/documents', checkToken, async (req: Request, res: Response) => {
  const userId = req.params.userid;
  const param = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    select: { documents: true }
  });
  res.json(param)
})

userRouter.put('/:userid/documents', async (req: Request, res: Response) => {
  const userId = req.params.userid;
  const { documents }: { documents: string[] } = req.body;
  const param = await prisma.user.update({
    where: { id: parseInt(userId) },
    select: { documents: true },
    data: { documents }
  });
  res.json(param)
})
