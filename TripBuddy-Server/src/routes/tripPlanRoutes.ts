import * as express from 'express';
import tripPlanController from '@controllers/tripPlanController';
import { authMiddleware } from '@middlewares/authMiddleware';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  tripPlanController.createTripPlan.bind(tripPlanController),
);

export {router as tripPlanRouter};
