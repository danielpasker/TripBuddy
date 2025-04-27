import {Router} from 'express';
import TripController from '../controllers/tripController';
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

export default router;
