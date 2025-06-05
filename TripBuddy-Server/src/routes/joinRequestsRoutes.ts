import {Router} from 'express';
import joinRequestController from '@controllers/joinRequestsController';
import {authMiddleware} from '@middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: JoinRequests
 *   description: API for managing join requests
 */

/**
 * @swagger
 * /join-requests:
 *   post:
 *     summary: Create a new join request
 *     tags: [JoinRequests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user requesting to join
 *               tripId:
 *                 type: string
 *                 description: ID of the trip to join
 *     responses:
 *       201:
 *         description: Join request created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware, joinRequestController.createJoinRequest);

/**
 * @swagger
 * /join-requests/{tripId}:
 *   get:
 *     summary: Get join requests by trip and user
 *     tags: [JoinRequests]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the trip
 *     responses:
 *       200:
 *         description: List of join requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   tripId:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *                   approvingUsers:
 *                     type: array
 *                     items:
 *                       type: string
 *                   decliningUsers:
 *                     type: array
 *                     items:
 *                       type: string
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: No join requests found
 *       500:
 *         description: Internal server error
 */
router.get('/:tripId', authMiddleware, joinRequestController.getJoinRequestsByTripAndUser);

/**
 * @swagger
 * /join-requests/approve:
 *   post:
 *     summary: Approve a join request
 *     tags: [JoinRequests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               joinRequestId:
 *                 type: string
 *                 description: ID of the join request
 *     responses:
 *       200:
 *         description: Join request approved successfully
 *       404:
 *         description: Join request or trip not found
 *       500:
 *         description: Internal server error
 */
router.post('/:id/approve', authMiddleware, joinRequestController.approve);

/**
 * @swagger
 * /join-requests/decline:
 *   post:
 *     summary: Decline a join request
 *     tags: [JoinRequests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               joinRequestId:
 *                 type: string
 *                 description: ID of the join request
 *     responses:
 *       200:
 *         description: Join request declined successfully
 *       404:
 *         description: Join request not found
 *       500:
 *         description: Internal server error
 */
router.post('/:id/decline', authMiddleware, joinRequestController.decline);

export {router as joinRequestsRouter};
