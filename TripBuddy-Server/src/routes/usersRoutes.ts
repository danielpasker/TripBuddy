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

/**
 * @swagger
 * /users/profile-picture:
 *   put:
 *     summary: Update user profile picture
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The user ID
 *                 example: 60d0fe4f5311236168a109ca
 *               imageUrl:
 *                 type: string
 *                 description: The new profile image URL
 *                 example: https://example.com/new-profile.jpg
 *     responses:
 *       200:
 *         description: The updated user data
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
 *                   example: https://example.com/new-profile.jpg
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */
router.put('/profile-picture', authMiddleware, usersController.updateProfileImage.bind(usersController));

/**
 * @swagger
 * /users/description:
 *   put:
 *     summary: Update user description
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The user ID
 *                 example: 60d0fe4f5311236168a109ca
 *               description:
 *                 type: string
 *                 description: The new user description
 *                 example: "Avid traveler and photographer."
 *     responses:
 *       200:
 *         description: The updated user data
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
 *                 description:
 *                   type: string
 *                   description: The user's updated description
 *                   example: "Avid traveler and photographer."
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */
router.put('/description', authMiddleware, usersController.updateUserDescription.bind(usersController));

/**
 * @swagger
 * /users/details:
 *   put:
 *     summary: Update user details
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               age:
 *                 type: number
 *                 description: The user's age
 *                 example: 30
 *               gender:
 *                 type: string
 *                 description: The user's gender
 *                 example: Male
 *               diet:
 *                 type: string
 *                 description: The user's diet preference
 *                 example: Vegetarian
 *               region:
 *                 type: string
 *                 description: The user's region
 *                 example: North America
 *     responses:
 *       200:
 *         description: The updated user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user ID
 *                   example: 60d0fe4f5311236168a109ca
 *                 age:
 *                   type: number
 *                   description: The user's age
 *                   example: 30
 *                 gender:
 *                   type: string
 *                   description: The user's gender
 *                   example: Male
 *                 diet:
 *                   type: string
 *                   description: The user's diet preference
 *                   example: Vegetarian
 *                 region:
 *                   type: string
 *                   description: The user's region
 *                   example: North America
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */
router.put('/details', authMiddleware, usersController.updateUserDetails.bind(usersController));

export {router as userRouter};
