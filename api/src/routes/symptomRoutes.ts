import { Router } from 'express';
import { 
    getAllSymptoms, 
    getSymptomById, 
    getSymptomsByCategory, 
    getCategories, 
    createSymptom, 
    updateSymptom, 
    deleteSymptom,
    seedSymptoms
} from '../controllers/symptomController';
import { validateToken } from '../middlewares/validateToken';

const router = Router();

router.post('/seed', seedSymptoms);
router.get('/', getAllSymptoms);
router.get('/categories', getCategories);
router.get('/category/:category', getSymptomsByCategory);
router.get('/:id', getSymptomById);
router.post('/', validateToken, createSymptom);
router.put('/:id', validateToken, updateSymptom);
router.delete('/:id', validateToken, deleteSymptom);

export default router;
