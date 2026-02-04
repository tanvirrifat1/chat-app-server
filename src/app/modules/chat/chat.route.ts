import express from 'express';
import { ChatController } from './chat.comntroller';

const router = express.Router();

router.post('/generate', ChatController.generateText);

export const ChatRoutes = router;
