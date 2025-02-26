import * as express from 'express';
import {authMiddleware} from '@controllers/authController';
import tripPlanController from '@controllers/tripPlanController';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  tripPlanController.createTripPlan.bind(tripPlanController),
);

export {router as tripPlanRouter};
