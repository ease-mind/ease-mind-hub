import { Router } from 'express'
import userRoutes from './userRoutes'
import authRoutes from './authRoutes'
import symptomRoutes from './symptomRoutes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/symptoms', symptomRoutes)

export default router