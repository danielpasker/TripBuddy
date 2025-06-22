import {Router} from 'express';
import TripController from '@controllers/tripsController';
import {authMiddleware} from '@middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * /trips:
 *   post:
 *     summary: Save a new trip
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startDate
 *               - endDate
 *               - users
 *               - plan
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *               plan:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Trip saved successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware, TripController.saveTrip);

/**
 * @swagger
 * /trips/match:
 *   get:
 *     summary: Get filtered and ranked list of trips
 *     tags: [Trips]
 *     parameters:
 *       - in: query
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: A list of filtered trips
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 *       500:
 *         description: Internal server error
 */
router.get('/match', authMiddleware, TripController.getFilteredTrips.bind(TripController));

/**
 * @swagger
 * /trips/{id}:
 *   get:
 *     summary: Get a trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       404:
 *         description: Trip not found
 */
router.get('/:id', authMiddleware, TripController.getTripById);

/**
 * @swagger
 * /trips/{tripId}/plan:
 *   get:
 *     summary: Get a trip's plan by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip plan retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Trip not found
 */
router.get('/:tripId/plan', authMiddleware, TripController.getTripPlanByTripId);

/**
 * @swagger
 * /trips/{tripId}/open-to-join:
 *   patch:
 *     summary: Update trip's open to join status
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isOpenToJoin:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Trip updated
 *       404:
 *         description: Trip not found
 */
router.patch('/:tripId/open-to-join', authMiddleware, TripController.setIsOpenToJoin);

/**
 * @swagger
 * /trips/{tripId}/leave:
 *   delete:
 *     summary: Leave a trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully left the trip
 *       404:
 *         description: Trip not found
 */
router.delete('/:tripId/leave', authMiddleware, TripController.leaveTrip);

export {router as tripRouter};
