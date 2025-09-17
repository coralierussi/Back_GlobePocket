import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Router } from "express";
export const userRouter = Router();

const prisma = new PrismaClient();

userRouter.get('/:userid/photos', async (req: Request, res: Response) => {
  const userId = req.params.userid;
  const param = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    select: { galerie: true }
  });
  res.json(param)
})

userRouter.post('/:userid/photos', async (req: Request, res: Response) => {
  const userId = req.params.userid;
  const { galerie }: { galerie: string[] } = req.body;
  const param = await prisma.user.update({
    where: { id: parseInt(userId) },
    data: { galerie }
  });
  res.json(param)
})