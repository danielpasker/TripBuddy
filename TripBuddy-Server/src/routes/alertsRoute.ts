import {getTripAlerts} from '@controllers/alertsController';
import {Router} from 'express';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Alert:
 *       type: object
 *       properties:
 *         eventId:
 *           type: string
 *           description: Unique identifier for the alert event.
 *         title:
 *           type: string
 *           description: Title or summary of the alert.
 *         description:
 *           type: string
 *           description: Detailed description of the alert.
 *         severity:
 *           type: string
 *           description: Severity level of the alert (e.g., info, warning, critical).
 *         location:
 *           type: string
 *           description: Location relevant to the alert.
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Start time of the alert.
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: End time of the alert.
 *       example:
 *         eventId: "abc123"
 *         title: "Flood Warning"
 *         description: "Heavy rainfall expected, risk of flooding in low-lying areas."
 *         severity: "warning"
 *         location: "Tel Aviv, Israel"
 *         startTime: "2024-06-01T08:00:00Z"
 *         endTime: "2024-06-01T20:00:00Z"
 */

/**
 * @swagger
 * /alerts/{tripId}:
 *   get:
 *     summary: Retrieve all alerts for a specific trip
 *     description: Fetches a list of alert objects associated with the provided trip ID. Each alert contains information about emergencies or important notifications relevant to the trip.
 *     tags:
 *       - Alerts
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the trip to retrieve alerts for
 *     responses:
 *       200:
 *         description: Successfully retrieved a list of alerts for the trip
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alert'
 *       400:
 *         description: Invalid trip ID supplied
 *       404:
 *         description: No alerts found for the specified trip
 *       500:
 *         description: Internal server error
 */
router.get('/:tripId', getTripAlerts);

export {router as alertsRouter};
