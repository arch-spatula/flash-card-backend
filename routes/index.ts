import { Router } from '../deps.ts';
import {
  addCard,
  removeCard,
  getCards,
  updateCard,
} from '../controllers/cards.ts';
import {
  refreshUserAccessToken,
  signIn,
  signUp,
} from '../controllers/users.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';

const router = new Router();

router
  .get('/api/card', authMiddleware, getCards)
  .post('/api/card', authMiddleware, addCard)
  .patch('/api/card/:id', authMiddleware, updateCard)
  .delete('/api/card/:id', authMiddleware, removeCard)
  .post('/api/auth/signup', signUp)
  .post('/api/auth/signin', signIn)
  .post('/api/auth/refresh', refreshUserAccessToken);

export default router;
