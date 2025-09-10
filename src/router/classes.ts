import { PrismaClient } from '@prisma/client'
import { Router } from "express";

export const classesRouter = Router();
const prisma = new PrismaClient()


classesRouter.post('/', async (req, res) => {
    const NewClasses = await prisma.classe.create({
        data: {
          name: req.body.name,
        }
    });
  res.status(201).json(NewClasses);
})

classesRouter.get("/:id", async (req, res) => {
  const myClasse = await prisma.classe.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
  if(!myClasse) {
    res.status(404).json({ message: "Classe not found" });
    return;
  }
  else {
    res.json(myClasse)
  }
})

classesRouter.put("/:id", async (req, res) => {
  const myClasse: any = await prisma.classe.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
  if(!myClasse) {
    res.status(404).json({ message: "Classe not found" });
    return;
  }
  else {
    myClasse.name = req.body.data.name;
    await myClasse.save();
    res.json(myClasse);
  }
})

classesRouter.get("/", async (req, res) => {
    let classes = await prisma.classe.findMany();
    const pagination = req.query.pagination as { limit?: string, start?: string};
    if (pagination && pagination.limit) {
      let start = 0;
      let end = parseInt (pagination.limit)
    }

    res.json(classes)
})


classesRouter.delete("/:id", async (req, res) => {
  const myClasse: any = await prisma.classe.findUnique({
    where: {
      id: parseInt(req.params.id)
    }
  });
   if(!myClasse) {
    res.status(404).json({ message: "Classe not found" });
    return;
  }
  else {
    await myClasse.destroy();
    res.json({ message: "Classe deleted" });
  }
})