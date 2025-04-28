import {Router} from 'express';
import usersController from '@controllers/usersController';
import {authMiddleware} from '@middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: The User API
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user ID
 *                   example: 60d0fe4f5311236168a109ca
 *                 userName:
 *                   type: string
 *                   description: The user's name
 *                   example: John Doe
 *                 profileImageUrl:
 *                   type: string
 *                   description: The user's profile image URL
 *                   example: https://example.com/profile.jpg
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */
router.get('/:id', authMiddleware, usersController.getUserById.bind(usersController));

/**
 * @swagger
 * /users/{userId}/trips:
 *   get:
 *     summary: Get trips for a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of user trips
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The trip ID
 *                     example: 60d0fe4f5311236168a109cb
 *                   location:
 *                     type: string
 *                     description: The trip location
 *                     example: Paris
 *                   countryCode:
 *                     type: string
 *                     description: The country code
 *                     example: FR
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     description: The trip start date
 *                     example: 2023-01-01
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     description: The trip end date
 *                     example: 2023-01-10
 *       404:
 *         description: Trips not found
 *       400:
 *         description: Bad request
 */
router.get('/:userId/trips', authMiddleware, usersController.getUserTrips.bind(usersController));

export {router as userRouter};
