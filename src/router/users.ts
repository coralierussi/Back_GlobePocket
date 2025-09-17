import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Router } from "express";
export const userRouter = Router();

const prisma = new PrismaClient();

