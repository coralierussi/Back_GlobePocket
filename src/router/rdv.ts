import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { checkToken } from '../middlewares/checkToken';
export const rdvRouter = express.Router();
// rdvRouter.use(checkToken)
const prisma = new PrismaClient();

rdvRouter.get('/', checkToken, async (req: Request, res: Response) => {
    const rdvs = await prisma.rendez_Vous.findMany({
        where: {
            userId: req.userId
        }
    });
    res.json(rdvs);
});

rdvRouter.post('/', checkToken, async (req: Request, res: Response) => {
    const { date_rdv, heure, titre, mail } : { date_rdv: Date; heure: Date; titre: string; mail: string } = req.body; 
    const rdv = await prisma.rendez_Vous.create({
        data: {
            date_rdv,
            heure,
            titre,
            mail,
            user: {
                connect: { id: req.userId }
            }
        }
    });
    res.json(rdv);
});

rdvRouter.put('/', checkToken, async (req: Request, res: Response) => {
    const userId = req.userId;
    const { date_rdv, heure, titre, mail } : { date_rdv: Date; heure: Date; titre: string; mail: string } = req.body; 
    const rdv = await prisma.rendez_Vous.update({
        where: { id : userId },
        data: {
            date_rdv,
            heure,
            titre,
            mail
        }
    });
    res.json(rdv);
});

rdvRouter.delete('/', checkToken, async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const rdv = await prisma.rendez_Vous.delete({
        where: { id: userId }
    });
    res.json(rdv);
});