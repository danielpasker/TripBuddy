import {getAlerts} from '@controllers/alertsController';
import {Router} from 'express';

const router = Router();

/**
 * @swagger
 * /alerts/{tripId}:
 *   get:
 *     summary: Get alerts for a specific trip
 *     description: Returns a list of alerts associated with the given trip ID.
 *     tags:
 *       - Alerts
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the trip to retrieve alerts for
 *     responses:
 *       200:
 *         description: A list of alerts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alert'
 *       404:
 *         description: No alerts found for the specified trip
 *       500:
 *         description: Server error
 */
router.get('/:tripId', getAlerts);

export {router as alertsRouter};
