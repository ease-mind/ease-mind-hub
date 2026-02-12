import { Router } from 'express'
import { validateId } from '../middlewares/validateId'
import { validateToken } from '../middlewares/validateToken'
import { createMethod, deleteMethod, getMethods, getMethodsByType } from '../controllers/methodController'

const router = Router()

router.get('/', validateToken, getMethods)
router.get('/types/:type', validateToken, getMethodsByType)
router.post('/', validateToken, createMethod)
router.delete('/:id', [validateId, validateToken], deleteMethod)

export default router