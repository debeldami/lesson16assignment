import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

dotenv.config();

let db = new JsonDB(new Config("db/MetaData", true, true, "/"));

const app: Express = express();

app.use(express.json());

const cors = require('cors')
app.use(cors());

const port = 8080;

app.get("/", (req: Request, res: Response) => {
  let data = db.getData(`/`);
  res.status(200).send(data);
});

app.get("/:id", (req: Request, res: Response) => {
  let data = db.getData(`/${req.params.id}`);
  res.status(200).send(data);
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
