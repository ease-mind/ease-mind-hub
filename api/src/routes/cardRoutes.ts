import { Router } from 'express'
import { getCards, createCard, deleteCard, getUserCards, blockCard } from '../controllers/cardController'
import { validateId } from '../middlewares/validateId'
import { validateToken } from '../middlewares/validateToken'

const router = Router()

router.get('/get-all-cards', validateToken, getCards)
router.get('/', validateToken, getUserCards)
router.post('/', validateToken, createCard)
router.put('/:id/block', validateToken, blockCard)
router.delete('/:id', [validateId, validateToken], deleteCard)

export default router