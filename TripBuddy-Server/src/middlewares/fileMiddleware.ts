import multer from 'multer';
import { mkdirSync } from 'node:fs';

const FILES_PATH = 'public/';

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        mkdirSync(FILES_PATH, { recursive: true });
        cb(null, FILES_PATH);
    },
    filename: (_req, file, cb) => {
        const ext = file.originalname.split('.').filter(Boolean).slice(1).join('.');
        cb(null, `${Date.now()}.${ext}`);
    },
});

export const fileMiddleware = multer({ storage }).single('file');
