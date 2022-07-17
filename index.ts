import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { create } from 'ipfs-http-client';
import { asyncHandler } from './utils';
import multer from 'multer';

import fs, { createReadStream } from 'fs';
const path = require('path');

dotenv.config();

const ipfsClient = create({
  host: 'localhost',
  port: 5001,
  protocol: 'http',
});

const upload = multer({ dest: 'uploads/' });

const DB_PATH = path.join('db', 'MetaData');

let db = new JsonDB(new Config(DB_PATH, true, true, '/'));

const app: Express = express();

app.use(express.json());

const port = process.env.PORT;

const data = db.getData('/');
let lastId =
  data && Object.keys(data).length > 0
    ? Math.max(...Object.keys(data).map((key) => Number(key)))
    : -1;

app.get('/', (req: Request, res: Response) => {
  let data = db.getData('/');
  res.send(data);
});

app.get(
  '/ipfs',
  asyncHandler(async (req: Request, res: Response) => {
    res.json({
      status: await ipfsClient.isOnline(),
    });
  })
);

app.get('/file/:id', (req: Request, res: Response) => {
  const fileId = req.params.id;
  try {
    const fileData = db.getData(`/${fileId}`).file;

    const readStream = createReadStream(`./uploads/${fileData.filename}`);

    readStream.on('open', function () {
      readStream.pipe(res);
    });

    res.set({
      'Content-Type': fileData.mimetype,
      'Content-Disposition': `attachment; filename="${fileData.filename}"`,
    });
  } catch (error) {
    res.json({
      error,
    });
  }
});

app.get('/:id', (req: Request, res: Response) => {
  res.json(db.getData(`/${req.params.id}`));
});

app.get(
  '/ipfs-get/:id',
  asyncHandler(async (req: Request, res: Response) => {
    //TODO
  })
);

app.post('/file', upload.single('nft'), (req: Request, res: Response) => {
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

    res.json({
      ...req.file,
    });
  } else {
    res.status(400).json({
      status: 'failed',
    });
  }
});

app.post(
  '/ipfs-save',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { fileId } = req.body;

      const fileData = db.getData(`/${fileId}`).file;

      const fileBytes = fs.readFileSync(`./uploads/${fileData.filename}`);

      const ipfsData = await ipfsClient.add(fileBytes);

      db.push(`/${fileId}/ipfs`, ipfsData);

      res.json(ipfsData);
    } catch (error) {
      res.json({
        status: 'error occur',
      });
    }
  })
);

app.post('/metadata', (req: Request, res: Response) => {
  const { fileId, metadata } = req.body;
  console.log(fileId, metadata);

  const { oS, hoodieColor, skinTone, color } = metadata;

  let file;

  try {
    file = db.getData(`/${fileId}/file`);
  } catch (error) {
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
