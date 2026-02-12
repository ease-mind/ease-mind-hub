import { Router } from 'express'
import { validateId } from '../middlewares/validateId'
import { validateToken } from '../middlewares/validateToken'
import { createCategory, deleteCategory, getCategories, getCategoriesByType } from '../controllers/categoryController'

const router = Router()

router.get('/', validateToken, getCategories)
router.get('/types/:type', validateToken, getCategoriesByType)
router.post('/', validateToken, createCategory)
router.delete('/:id', [validateId, validateToken], deleteCategory)

export default router