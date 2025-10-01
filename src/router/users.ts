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

// Get user info
userRouter.get('/me', checkToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé.' });
  }

  // remove mdp from user object
  const { mdp, ...userWithoutPassword } = user;

  res.json(userWithoutPassword);
})

// Update user info
userRouter.put('/', checkToken, async (req: Request, res: Response) => {
  const userId = req.userId;
  const {
          name,
          pseudo,
          ville,
          pays,
          date_anniversaire,
          sexe,
          galerie,
          documents,
          description,
          cp
        }: {
          name: string;
          pseudo: string;
          ville: string;
          pays: string;
          date_anniversaire: Date;
          sexe: Sexe;
          galerie: string[];
          documents: string[];
          description: string;
          cp: number
        } = req.body;
  const param = await prisma.user.update({
    where: { id: userId },
    select: { id: true, 
      name: true, 
      email: true, 
      pseudo: true, 
      ville: true, 
      pays: true, 
      date_anniversaire: true, 
      sexe: true, 
      galerie: true, 
      documents: true, 
      description: true, 
      cp: true
    },
    data: {
      name,
      pseudo,
      ville,
      pays,
      date_anniversaire,
      sexe,
      galerie,
      documents,
      description,
      cp
    }
  });
  res.json(param)
});


userRouter.get('/photos', checkToken, async (req: Request, res: Response) => {
  const userId = req.userId
  const param = await prisma.user.findUnique({
    where: { id: userId },
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

userRouter.get('/documents', checkToken, async (req: Request, res: Response) => {
  const userId = req.userId;
  const param = await prisma.user.findUnique({
    where: { id: userId },
    select: { documents: true }
  });
  res.json(param)
})

userRouter.put('/documents', async (req: Request, res: Response) => {
  const userId = req.userId;
  const { documents }: { documents: string[] } = req.body;
  const param = await prisma.user.update({
    where: { id: userId },
    select: { documents: true },
    data: { documents }
  });
  res.json(param)
})
