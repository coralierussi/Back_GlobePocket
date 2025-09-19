import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { checkToken } from '../middlewares/checkToken';
export const userRouter = express.Router();

const prisma = new PrismaClient();

userRouter.get("/", async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  console.log("getting users");
  res.json(users);
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
