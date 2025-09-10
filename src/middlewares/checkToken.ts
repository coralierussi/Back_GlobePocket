import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient()

export async function checkToken (req: Request, res: Response, next: NextFunction) {
    const fullToken = req.headers.authorization;
    if (!fullToken) {
        res.status(401).send("No token provided");
    }
    else {

        const [typeToken, token] = fullToken.split(" ");
        if(typeToken !== "Bearer"){
            res.status(401).send("Invalid token type");
        }
        else {
            const token = (req.headers.authorization || '').split(' ')[1] || ''
            try {
                console.log('token', token)
                const decoded = jwt.verify(token, process.env.JWT_SECRET!)
                if (decoded) {
                    console.log('decoded', decoded);
                    next()
                }
            }
            catch(e){
                console.log('invalid token on verify', e)
                res.status(401).send("Invalid token on verify");
            }
        }
    }
}