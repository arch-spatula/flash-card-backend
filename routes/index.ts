import { Router } from '../deps.ts';
import {
  addCard,
  deleteCard,
  getCards,
  updateCard,
} from '../controllers/cards.ts';
import { signin, signup } from '../controllers/users.ts';

const router = new Router();

router
  .get('/api/card', getCards)
  .post('/api/card', addCard)
  .patch('/api/card/:id', updateCard)
  .delete('/api/card/:id', deleteCard)
  .post('/api/auth/signup', signup)
  .post('/api/auth/signin', signin);

export default router;
