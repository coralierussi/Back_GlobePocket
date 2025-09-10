import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

export const authRouter = Router();
const prisma = new PrismaClient();


authRouter.post("/local", async (req, res) => {
    const { name, mdp } = req.body;
    const userWithEmail = await prisma.user.findFirst({ where: { email: name } });
    if (!userWithEmail) {
        res.status(400).json("Email or mdp is incorrect");
    }
    else {
        const isMdpCorrect = await bcrypt.compare(mdp, userWithEmail.mdp);
        if (isMdpCorrect) {
            const token = jwt.sign(userWithEmail, process.env.JWT_SECRET!);
            res.json({
                token,
                ...userWithEmail
            });
        }
        else {
            res.status(400).json("Email or mdp is incorrect");
        }
    }
})