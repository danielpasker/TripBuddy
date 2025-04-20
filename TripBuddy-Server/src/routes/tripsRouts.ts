import express from 'express';
import { createTrip } from '../controllers/tripController';

const router = express.Router();

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Create a new trip
 *     description: Creates a new trip with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *                 description: The start date of the trip.
 *               endDate:
 *                 type: string
 *                 description: The end date of the trip.
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: User ID of the trip participant.
 *               plan:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Trip plan IDs for itinerary.
 *     responses:
 *       201:
 *         description: Trip successfully created.
 *       500:
 *         description: Internal server error.
 */
router.post('/trips', createTrip);

export default router;
