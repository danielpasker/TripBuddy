import { Router } from 'express';
import { getDestinations } from '@controllers/destinationsController';
import { authMiddleware } from '@middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Destination:
 *       type: object
 *       properties:
 *         city:
 *           type: string
 *           description: The city name.
 *         country:
 *           type: string
 *           description: The country name.
 *         place_id:
 *           type: string
 *           description: The unique identifier for the place.
 *       example:
 *         city: "Tel Aviv-Yafo"
 *         country: "Israel"
 *         place_id: "ChIJYar-modLHRURYkuTg3E8RQA"
 */

/**
 * @swagger
 * /api/destinations:
 *   get:
 *     summary: Retrieves a list of destinations based on a search query.
 *     description: Returns an array of destinations (city, country, place_id) fetched from the Google Places API. The results are cached for 24 hours.
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: The search term for destinations.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of destinations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Destination'
 *       400:
 *         description: Query parameter is required.
 *       500:
 *         description: Server error.
 */
router.get('/', authMiddleware, getDestinations);

export { router as destinationsRouter };
