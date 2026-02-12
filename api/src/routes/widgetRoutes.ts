import { Router } from 'express'
import { validateToken } from '../middlewares/validateToken'
import { getWidget } from '../controllers/widgetController'

const router = Router()

router.get('/:key', validateToken, getWidget)

export default router