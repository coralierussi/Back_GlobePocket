import cors from "cors";
import "dotenv/config";
import express from "express";

import { usersRouter } from "./router/users";
import { elevesRouter } from "./router/eleves";
import { classesRouter } from "./router/classes";
import { groupesRouter } from "./router/groupes";
import { checkToken } from "./middlewares/checkToken";
import { authRouter } from "./router/auth";

const app = express();

app.use(cors());
app.use(express.json());

const apiRouter = express.Router();
apiRouter.use("/users", usersRouter)
apiRouter.use("/eleves", checkToken, elevesRouter)
apiRouter.use("/classes", checkToken, classesRouter)
apiRouter.use("/groupes", checkToken, groupesRouter)
apiRouter.use("/auth", authRouter)

app.use("/api", apiRouter);


app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
