import { Router } from '../deps.ts';
import {
  addCard,
  deleteCard,
  getCards,
  updateCard,
} from '../controllers/cards.ts';
import {
  deleteUser,
  refreshUserAccessToken,
  signIn,
  signUp,
  checkEmail,
} from '../controllers/users.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';

const router = new Router();

router
  .get('/api/card', authMiddleware, getCards)
  .post('/api/card', authMiddleware, addCard)
  .patch('/api/card/:id', authMiddleware, updateCard)
  .delete('/api/card/:id', authMiddleware, deleteCard)
  .post('/api/auth/signup', signUp)
  .post('/api/auth/signin', signIn)
  .post('/api/auth/refresh', refreshUserAccessToken)
  .post('/api/auth/check-email', checkEmail)
  .delete('/api/auth/delete', authMiddleware, deleteUser);

export default router;
