import { Router } from 'express'
import userRoutes from './userRoutes'
import authRoutes from './authRoutes'
import symptomRoutes from './symptomRoutes'
import userSymptomRoutes from './userSymptomRoutes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/symptoms', symptomRoutes)
router.use('/user-symptoms', userSymptomRoutes)

export default router