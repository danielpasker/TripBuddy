import * as express from 'express';
import tripPlanController from '@controllers/tripPlanController';
import {authMiddleware} from '@middlewares/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, tripPlanController.createTripPlan.bind(tripPlanController));

/**
 * @swagger
 * /trip-plan/{tripId}/activity:
 *   post:
 *     summary: Add a new activity to a specific day in the trip plan
 *     tags: [TripPlan]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the trip
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - day
 *               - activity
 *               - location
 *             properties:
 *               day:
 *                 type: number
 *                 description: The day number to add the activity to
 *               activity:
 *                 type: string
 *                 description: The activity name
 *               location:
 *                 type: string
 *                 description: The location of the activity
 *     responses:
 *       200:
 *         description: Activity added successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Trip or day not found
 *       500:
 *         description: Server error
 */
router.post('/:tripId/activity', authMiddleware, tripPlanController.addActivity.bind(tripPlanController));

export {router as tripPlanRouter};
