import {Router} from 'express';
import ChatsController from '@controllers/chatController';
import {authMiddleware} from '@middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: The Chats API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       required:
 *         - participants
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the chat
 *         participants:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of user IDs in the chat
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the chat was created
 *       example:
 *         _id: "60f7c0d9b6e99c001c5e8a3a"
 *         participants:
 *           - "60f7bf99b6e99c001c5e8a38"
 *           - "60f7bfa3b6e99c001c5e8a39"
 *         createdAt: "2025-05-24T12:34:56.789Z"
 *
 *     Message:
 *       type: object
 *       required:
 *         - chatId
 *         - senderId
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the message
 *         chatId:
 *           type: string
 *           description: ID of the chat this message belongs to
 *         senderId:
 *           type: string
 *           description: ID of the user who sent the message
 *         content:
 *           type: string
 *           description: The message text
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: When the message was sent
 *       example:
 *         _id: "60f7c2e4b6e99c001c5e8a3b"
 *         chatId: "60f7c0d9b6e99c001c5e8a3a"
 *         senderId: "60f7bf99b6e99c001c5e8a38"
 *         content: "Hello, how are you?"
 *         timestamp: "2025-05-24T12:35:00.000Z"
 */

/**
 * @swagger
 * /chats:
 *   get:
 *     summary: Create a new chat
 *     description: Create a chat between participants
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
 *                 description: Array of user IDs to include
 *             required:
 *               - participantsIds
 *     responses:
 *       201:
 *         description: Chat created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       400:
 *         description: Missing or invalid required fields
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, ChatsController.createChat.bind(ChatsController));

/**
 * @swagger
 * /chats/{userId}:
 *   get:
 *     summary: Get chats by user ID
 *     description: Retrieve all chats in which the specified user participates
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of chats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Chat'
 *       404:
 *         description: No chats found for this user
 *       500:
 *         description: Server error
 */
router.get('/:userId', authMiddleware, ChatsController.getChatByUserId.bind(ChatsController));

/**
 * @swagger
 * /chats/messages:
 *   post:
 *     summary: Send a new message
 *     description: Save and broadcast a new message in a chat
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
 *               chatId:
 *                 type: string
 *                 description: The chat ID
 *               senderId:
 *                 type: string
 *                 description: The sending user ID
 *               content:
 *                 type: string
 *                 description: The message text
 *             required:
 *               - chatId
 *               - senderId
 *               - content
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Missing or invalid required fields
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Server error
 */
router.post('/messages', authMiddleware, ChatsController.sendMessage.bind(ChatsController));

/**
 * @swagger
 * /api/chats/messages/{id}:
 *   get:
 *     summary: Get messages by chat ID
 *     description: Retrieve all messages from a specific chat
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The chat ID
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       404:
 *         description: Chat not found
 *       500:
 *         description: Server error
 */
router.get('/messages/:id', authMiddleware, ChatsController.getMessagesByChatId.bind(ChatsController));

export {router as chatsRouter};
