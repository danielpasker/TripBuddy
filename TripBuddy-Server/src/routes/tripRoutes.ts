import { Router } from 'express';
import TripController from '../controllers/tripsContreller';

const router = Router();

router.post('/', TripController.saveTrip);

export default router;
