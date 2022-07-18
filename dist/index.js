"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_json_db_1 = require("node-json-db");
const JsonDBConfig_1 = require("node-json-db/dist/lib/JsonDBConfig");
const cors = require('cors');
app.use(cors());
dotenv_1.default.config();
let db = new node_json_db_1.JsonDB(new JsonDBConfig_1.Config("db/MetaData", true, true, "/"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT;
app.get("/", (req, res) => {
    let data = db.getData(`/`);
    res.status(200).send(data);
});
app.get("/:id", (req, res) => {
    let data = db.getData(`/${req.params.id}`);
    res.status(200).send(data);
});
app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}`);
});
