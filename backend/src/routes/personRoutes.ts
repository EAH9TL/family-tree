import { Router } from 'express';
import {
  getAllPersons,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
} from '../controllers/personController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getAllPersons);
router.get('/:id', getPersonById);
router.post('/', createPerson);
router.put('/:id', updatePerson);
router.delete('/:id', deletePerson);

export default router;