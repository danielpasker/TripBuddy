import {Router} from 'express';
import {searchImagesByQuery} from '@controllers/imageSearchController';
import {authMiddleware} from '@middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Image Search
 *   description: API for getting images from Pexels
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Photo:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: The unique identifier for the photo
 *         width:
 *           type: number
 *           description: The width of the photo
 *         height:
 *           type: number
 *           description: The height of the photo
 *         url:
 *           type: string
 *           description: The URL of the photo page
 *         photographer:
 *           type: string
 *           description: The name of the photographer
 *         photographer_url:
 *           type: string
 *           description: The URL of the photographer's profile
 *         src:
 *           type: object
 *           properties:
 *             original:
 *               type: string
 *               description: The URL of the original photo
 *             large2x:
 *               type: string
 *               description: The URL of the large photo (2x)
 *             large:
 *               type: string
 *               description: The URL of the large photo
 *             medium:
 *               type: string
 *               description: The URL of the medium photo
 *             small:
 *               type: string
 *               description: The URL of the small photo
 *             portrait:
 *               type: string
 *               description: The URL of the portrait photo
 *             landscape:
 *               type: string
 *               description: The URL of the landscape photo
 *             tiny:
 *               type: string
 *               description: The URL of the tiny photo
 */

/**
 * @swagger
 * /image-search/{query}:
 *   get:
 *     summary: Search for images using a query
 *     description: Search for images from Pexels API based on a query string. Results are cached for 24 hours.
 *     tags: [Image Search]
 *     security:
 *       - bearerUser: []
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         description: The search term for images
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Photo'
 *       400:
 *         description: Query parameter is required
 *       401:
 *         description: Unauthorized - Authentication required
 *       500:
 *         description: Server error
 */
router.get('/:query', authMiddleware, searchImagesByQuery);

export {router as imageSearchRouter};
