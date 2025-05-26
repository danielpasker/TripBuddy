import { Router } from 'express';
import TripController from '@controllers/tripsController';
import { authMiddleware } from '@middlewares/authMiddleware';

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
 * /trips/match:
 *   get:
 *     summary: Get filtered and ranked list of trips
 *     description: Retrieves a list of trips based on the provided filters and ranks them by relevance to the user.
 *     tags:
 *       - Trips
 *     parameters:
 *       - in: query
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *         description: Location to filter trips by (e.g., city or country name)
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Minimum trip start date
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Maximum trip end date
 *       - in: query
 *         name: tripType
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: List of preferred trip types (e.g., adventure, cultural)
 *       - in: query
 *         name: budget
 *         required: true
 *         schema:
 *           type: number
 *         description: Maximum budget for the trip
 *       - in: query
 *         name: maxParticipants
 *         required: true
 *         schema:
 *           type: integer
 *         description: Maximum number of participants allowed
 *       - in: query
 *         name: gender
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Preferred genders of other participants
 *       - in: query
 *         name: religion
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Preferred religions of other participants
 *       - in: query
 *         name: dietaryPreferences
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Preferred dietary preferences of other participants
 *       - in: query
 *         name: averageAge
 *         required: false
 *         schema:
 *           type: number
 *         description: Preferred average age of participants
 *     responses:
 *       200:
 *         description: A list of scored and filtered trips
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/Trip' # Reference the Trip schema
 *       500:
 *         description: Internal server error
 */
router.get('/match', authMiddleware, TripController.getFilteredTrips.bind(TripController))

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

/**
 * @swagger
 * /trips/{id}/open-to-join:
 *   put:
 *     summary: Set whether a trip is open to join
 *     tags:
 *       - Trips
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the trip to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isOpenToJoin
 *             properties:
 *               isOpenToJoin:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Internal server error
 */
router.put('/:tripId/open-to-join', authMiddleware, TripController.setIsOpenToJoin);


export { router as tripRouter };
