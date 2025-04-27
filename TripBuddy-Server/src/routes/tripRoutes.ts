import { Router } from 'express';
import TripController from '../controllers/tripController';

const router = Router();

router.post('/', TripController.saveTrip);

export default router;
