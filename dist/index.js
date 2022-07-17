"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_json_db_1 = require("node-json-db");
const JsonDBConfig_1 = require("node-json-db/dist/lib/JsonDBConfig");
const ipfs_http_client_1 = require("ipfs-http-client");
const utils_1 = require("./utils");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importStar(require("fs"));
const path = require('path');
dotenv_1.default.config();
const ipfsClient = (0, ipfs_http_client_1.create)({
    host: 'localhost',
    port: 5001,
    protocol: 'http',
});
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const DB_PATH = path.join('db', 'MetaData');
let db = new node_json_db_1.JsonDB(new JsonDBConfig_1.Config(DB_PATH, true, true, '/'));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT;
const data = db.getData('/');
let lastId = data && Object.keys(data).length > 0
    ? Math.max(...Object.keys(data).map((key) => Number(key)))
    : -1;
app.get('/', (req, res) => {
    let data = db.getData('/');
    res.send(data);
});
app.get('/ipfs', (0, utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        status: yield ipfsClient.isOnline(),
    });
})));
app.get('/file/:id', (req, res) => {
    const fileId = req.params.id;
    try {
        const fileData = db.getData(`/${fileId}`).file;
        const readStream = (0, fs_1.createReadStream)(`./uploads/${fileData.filename}`);
        readStream.on('open', function () {
            readStream.pipe(res);
        });
        res.set({
            'Content-Type': fileData.mimetype,
            'Content-Disposition': `attachment; filename="${fileData.filename}"`,
        });
    }
    catch (error) {
        res.json({
            error,
        });
    }
});
app.get('/:id', (req, res) => {
    res.json(db.getData(`/${req.params.id}`));
});
app.get('/ipfs-get/:id', (0, utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () { })));
app.post('/file', upload.single('nft'), (req, res) => {
    if (req.file) {
        ++lastId;
        const { originalname, mimetype, filename, size } = req.file;
        db.push(`/${lastId}`, {
            file: {
                originalname,
                mimetype,
                filename,
                size,
            },
        });
        res.json(Object.assign({}, req.file));
    }
    else {
        res.status(400).json({
            status: 'failed',
        });
    }
});
app.post('/ipfs-save', (0, utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fileId } = req.body;
        const fileData = db.getData(`/${fileId}`).file;
        const fileBytes = fs_1.default.readFileSync(`./uploads/${fileData.filename}`);
        const ipfsData = yield ipfsClient.add(fileBytes);
        db.push(`/${fileId}/ipfs`, ipfsData);
        res.json(ipfsData);
    }
    catch (error) {
        res.json({
            status: 'error occur',
        });
    }
})));
app.post('/metadata', (req, res) => {
    const { fileId, metadata } = req.body;
    console.log(fileId, metadata);
    const { oS, hoodieColor, skinTone, color } = metadata;
    let file;
    try {
        file = db.getData(`/${fileId}/file`);
    }
    catch (error) {
        return res.json({
            error: 'an error occur',
        });
    }
    if (!file)
        return res.json({
            error: 'an error occur',
        });
    db.push(`/${fileId}/metadata`, { oS, hoodieColor, skinTone, color });
    return res.json(db.getData(`/${fileId}`));
});
app.listen(port, () => {
    console.log(`Server is running at https://localhost:${port}`);
});
