import { Router } from '../deps.ts';
import {
  addCard,
  deleteCard,
  getCards,
  updateCard,
} from '../controllers/cards.ts';
import { signin, signout, signup } from '../controllers/users.ts';
import { authMiddleware } from '../middleware/authMiddleware.ts';

const router = new Router();

router
  .get('/api/card', authMiddleware, getCards)
  .post('/api/card', authMiddleware, addCard)
  .patch('/api/card/:id', authMiddleware, updateCard)
  .delete('/api/card/:id', authMiddleware, deleteCard)
  .post('/api/auth/signup', signup)
  .post('/api/auth/signin', signin)
  .post('/api/auth/signout', signout);

export default router;
