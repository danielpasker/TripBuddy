import {Router} from 'express';
import ChatsController from '@controllers/chatController';
import {authMiddleware} from '@middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: Endpoints for chat creation, retrieval and messaging
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Chat:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the chat
 *         participantsIds:
 *           type: array
 *           items:
 *             type: string
 *           description: List of participant user IDs
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Chat creation timestamp
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         chatId:
 *           type: string
 *         senderId:
 *           type: string
 *         content:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /chats:
 *   post:
 *     summary: Create a new chat or retrieve an existing chat among participants.
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participantsIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               participantsIds: ["60f7d30a08c8e91234abcd01", "60f7d30a08c8e91234abcd02"]
 *     responses:
 *       200:
 *         description: Existing or newly created chat with its messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chat:
 *                   $ref: '#/components/schemas/Chat'
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       400:
 *         description: Bad request – at least two participants are required.
 *       401:
 *         description: Unauthorized – missing or invalid token.
 */
router.post('/', authMiddleware, ChatsController.createOrGetChat.bind(ChatsController));

/**
 * @swagger
 * /chats/{chatId}:
 *   get:
 *     summary: Get chat by ID along with its messages.
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: chatId
 *         in: path
 *         required: true
 *         description: The ID of the chat to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat and its messages returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chat:
 *                   $ref: '#/components/schemas/Chat'
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized – missing or invalid token.
 *       403:
 *         description: Forbidden – user is not a participant in the chat.
 *       404:
 *         description: Chat not found.
 */
router.get('/:chatId', authMiddleware, ChatsController.getChatById.bind(ChatsController));

/**
 * @swagger
 * /chats/{chatId}/messages:
 *   post:
 *     summary: Send a new message in a specific chat.
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: chatId
 *         in: path
 *         required: true
 *         description: The ID of the chat to send the message to.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *             required:
 *               - content
 *             example:
 *               content: "Hello, world!"
 *     responses:
 *       201:
 *         description: Newly created message.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       401:
 *         description: Unauthorized – missing or invalid token.
 *       403:
 *         description: Forbidden – user is not a participant in the chat.
 *       404:
 *         description: Chat not found.
 */
router.post('/:chatId/messages', authMiddleware, ChatsController.sendMessage.bind(ChatsController));

export {router as chatsRouter};
