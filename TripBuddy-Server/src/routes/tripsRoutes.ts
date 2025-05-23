import {Router} from 'express';
import TripController from '@controllers/tripsController';
import {authMiddleware} from '@middlewares/authMiddleware';

const router = Router();
/**
 * @swagger
 * /trip:
 *   post:
 *     summary: Save a new trip
 *     tags:
 *       - Trips
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
 *                 example: "2025-05-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-10"
 *               users:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "6633a2b1f1b0ab1f3a1b2c3d"
 *               plan:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - location
 *                     - countryCode
 *                     - days
 *                     - budget
 *                     - participants
 *                     - plan
 *                   properties:
 *                     location:
 *                       type: string
 *                       example: "Paris"
 *                     countryCode:
 *                       type: string
 *                       example: "FR"
 *                     days:
 *                       type: integer
 *                       example: 5
 *                     budget:
 *                       type: string
 *                       example: "Medium"
 *                     participants:
 *                       type: integer
 *                       example: 2
 *                     plan:
 *                       type: array
 *                       items:
 *                         type: object
 *                         required:
 *                           - day
 *                           - activities
 *                         properties:
 *                           day:
 *                             type: integer
 *                             example: 1
 *                           activities:
 *                             type: array
 *                             items:
 *                               type: object
 *                               required:
 *                                 - activity
 *                                 - location
 *                               properties:
 *                                 activity:
 *                                   type: string
 *                                   example: "Visit Eiffel Tower"
 *                                 location:
 *                                   type: string
 *                                   example: "Paris"
 *                                 isValid:
 *                                   type: boolean
 *                                   default: true
 *                                 validationDetails:
 *                                   type: object
 *                                   description: "Optional validation information"
 *     responses:
 *       200:
 *         description: Trip saved successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware, TripController.saveTrip);

/**
 * @swagger
 * /trips/{id}:
 *   get:
 *     summary: Get a trip by its ID
 *     tags:
 *       - Trips
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the trip to retrieve
 *         example: "664b1f2a1b2c3d4e5f6a7b8c"
 *     responses:
 *       200:
 *         description: Trip details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip' # Reference the Trip schema
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authMiddleware, TripController.getTripById);

/**
 * @swagger
 * /trips/{tripId}/plan:
 *   get:
 *     summary: Get the trip plan by trip ID
 *     tags:
 *       - Trips
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the trip to retrieve the plan for
 *         example: "664b1f2a1b2c3d4e5f6a7b8c"
 *     responses:
 *       200:
 *         description: Trip plan retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   day:
 *                     type: integer
 *                     example: 1
 *                   activities:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         activity:
 *                           type: string
 *                           example: "Visit Eiffel Tower"
 *                         location:
 *                           type: string
 *                           example: "Paris"
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Internal server error
 */
router.get('/:tripId/plan', authMiddleware, TripController.getTripPlanByTripId);

export {router as tripRouter};
