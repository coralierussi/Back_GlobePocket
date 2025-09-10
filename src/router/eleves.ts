import { PrismaClient } from '@prisma/client'
import { Router } from "express";

export const elevesRouter = Router();
const prisma = new PrismaClient()

elevesRouter.post('/', async (req, res) => {
  const NewEleve = await prisma.eleve.create({
    data: {
      email: req.body.name + "@gmail.com",
      name: req.body.name,
      classeId: req.body.classeId
    }
  });
  res.status(201).json(NewEleve);
})

elevesRouter.get("/:id", async (req, res) => {
  const myEleves = await prisma.eleve.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
  if(!myEleves) {
    res.status(404).json({ message: "Eleve not found" });
    return;
  }
  else {
    res.json(myEleves)
  }
})

elevesRouter.put("/:id", async (req, res) => {
  const myEleves: any = await prisma.eleve.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
  if(!myEleves) {
    res.status(404).json({ message: "Eleve not found" });
    return;
  }
  else {
    myEleves.email = req.body.data.email;
    myEleves.name = req.body.data.name;
    await myEleves.save();
    res.json(myEleves);
  }
})

elevesRouter.get("/", async (req, res) => {
    let eleves = await prisma.eleve.findMany();
    const pagination = req.query.pagination as { limit?: string, start?: string};
    if (pagination && pagination.limit) {
      let start = 0;
      let end = parseInt (pagination.limit)
    }

    res.json(eleves)
})


elevesRouter.delete("/:id", async (req, res) => {
  const myEleves: any = await prisma.eleve.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
   if(!myEleves) {
    res.status(404).json({ message: "Eleve not found" });
    return;
  }
  else {
    await myEleves.destroy();
    res.json({ message: "Eleve deleted" });
  }
})