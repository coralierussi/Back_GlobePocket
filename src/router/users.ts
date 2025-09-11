import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Router } from "express";
const router = Router();
// import bcrypt from "bcrypt";


// usersRouter.post('/', async (req, res) => {
//   const { email, mdp} = req.body;
//   const hashMdp = await bcrypt.hash(
//     mdp,
//     parseInt(process.env.SALT_ROUNDS!)
//   );
//   const NewUser = await prisma.user.create({
//     data: {
//       email: email,
//       mdp: hashMdp,
//     }
//   });
//   res.status(201).json(NewUser);
// })

// usersRouter.get("/:id", async (req, res) => {
//   const myUsers = await prisma.user.findUnique({
//     where: {
//       id: parseInt(req.params.id)
//     }
//   });
//   if(!myUsers) {
//     res.status(404).json({ message: "User not found" });
//     return;
//   }
//   else {
//     res.json(myUsers)
//   }
// })

// usersRouter.put("/:id", async (req, res) => {
//   const myUsers: any = await prisma.user.findUnique({
//     where: {
//       id: parseInt(req.params.id)
//     }
//   });
//   if(!myUsers) {
//     res.status(404).json({ message: "User not found" });
//     return;
//   }
//   else {
//     myUsers.email = req.body.data.email;
//     myUsers.mdp = req.body.data.mdp;
//     await myUsers.save();
//     res.json(myUsers);
//   }
// })

// usersRouter.get("/", async (req, res) => {
//     let users = await prisma.user.findMany();
//     const pagination = req.query.pagination as { limit?: string, start?: string};
//     if (pagination && pagination.limit) {
//       let start = 0;
//       let end = parseInt (pagination.limit)
//     }

//     res.json(users)
// })


// usersRouter.delete("/:id", async (req, res) => {
//   const myUsers: any = await prisma.user.findUnique({
//     where: {
//       id: parseInt(req.params.id)
//     }
//   });
//    if(!myUsers) {
//     res.status(404).json({ message: "User not found" });
//     return;
//   }
//   else {
//     await myUsers.destroy();
//     res.json({ message: "User deleted" });
//   }
// })



const prisma = new PrismaClient();

router.post('/register', async (req: Request, res: Response) => {
  const { email, mdp, name, sexe }: { email: string; mdp: string; name: string; sexe: 'Homme' | 'Femme' | 'Autre' } = req.body;

  try {
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return res.status(409).json({ message: 'Utilisateur déjà inscrit.' });
    }

    await prisma.user.create({
      data: { email, mdp, name, sexe: 'Autre' },
    });

    res.status(201).json({ message: 'Inscription réussie.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
