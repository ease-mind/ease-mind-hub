import { Router } from 'express';
import { 
    saveUserSymptoms,
    getUserSymptomHistory,
    getLatestUserSymptoms,
    deleteUserSymptom,
    getUserSymptomStats
} from '../controllers/userSymptomController';
import { validateToken } from '../middlewares/validateToken';

const router = Router();

router.post('/', validateToken, saveUserSymptoms);
router.get('/history/:userId', validateToken, getUserSymptomHistory);
router.get('/latest/:userId', validateToken, getLatestUserSymptoms);
router.get('/stats/:userId', validateToken, getUserSymptomStats);
router.delete('/:id', validateToken, deleteUserSymptom);

export default router;
