import { Router } from 'express';
import { uploadFile } from '@controllers/filesController';
import { authMiddleware } from '@middlewares/authMiddleware';
import { fileMiddleware } from '@middlewares/fileMiddleware';

const router = Router();

router.post('/', authMiddleware, fileMiddleware, uploadFile);

export { router as filesRouter };
