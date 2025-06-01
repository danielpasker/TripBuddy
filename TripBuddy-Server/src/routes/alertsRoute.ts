import {getAlerts} from '@controllers/alertsController';
import {Router} from 'express';

const router = Router();

router.get('/', getAlerts);

export {router as alertsRouter};
