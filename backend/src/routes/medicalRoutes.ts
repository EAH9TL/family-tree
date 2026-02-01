import { Router } from 'express';
import {
  getMedicalConditionsByPerson,
  createMedicalCondition,
  updateMedicalCondition,
  deleteMedicalCondition,
} from '../controllers/medicalController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/person/:personId', getMedicalConditionsByPerson);
router.post('/', createMedicalCondition);
router.put('/:id', updateMedicalCondition);
router.delete('/:id', deleteMedicalCondition);

export default router;