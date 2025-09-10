import { PrismaClient } from '@prisma/client'
import { Router } from "express";

export const groupesRouter = Router();
const prisma = new PrismaClient()


groupesRouter.post('/', async (req, res) => {
  const NewGroupe = await prisma.groupe.create({
    data: {
      name: req.body.name,
  }
  });
  res.status(201).json(NewGroupe);
})

groupesRouter.get("/:id", async (req, res) => {
  const myGroupes = await prisma.groupe.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
  if(!myGroupes) {
    res.status(404).json({ message: "Groupe not found" });
    return;
  }
  else {
    res.json(myGroupes)
  }
})

groupesRouter.put("/:id", async (req, res) => {
  const myGroupes: any = await prisma.groupe.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
  if(!myGroupes) {
    res.status(404).json({ message: "Groupe not found" });
    return;
  }
  else {
    myGroupes.name = req.body.data.name;
    await myGroupes.save();
    res.json(myGroupes);
  }
})

groupesRouter.get("/", async (req, res) => {
    let groupes = await prisma.groupe.findMany();
    const pagination = req.query.pagination as { limit?: string, start?: string};
    if (pagination && pagination.limit) {
      let start = 0;
      let end = parseInt (pagination.limit)
    }

    res.json(groupes)
})


groupesRouter.delete("/:id", async (req, res) => {
  const myGroupes: any = await prisma.groupe.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
   if(!myGroupes) {
    res.status(404).json({ message: "Groupe not found" });
    return;
  }
  else {
    await myGroupes.destroy();
    res.json({ message: "Groupe deleted" });
  }
})