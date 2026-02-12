import { Router } from 'express';
import { getUsers, deleteUser, updateUser, updateUserWidgets, updateAddress, getAddress, updateProfileImage, getUser } from '../controllers/userController';
import { validateId } from '../middlewares/validateId';
import { validateToken } from '../middlewares/validateToken';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router()

router.get('/', validateToken, getUsers)
router.get('/:id', [validateId, validateToken],  getUser)
router.put('/:id', [validateId, validateToken],  updateUser)
router.delete('/:id', [validateId, validateToken], deleteUser)
router.put('/:id/widgets', [validateId, validateToken], updateUserWidgets);
router.get('/:id/address', [validateId, validateToken], getAddress);
router.put('/:id/address', [validateId, validateToken], updateAddress);
router.put('/:id/profile-image', upload.single('file'), validateToken, updateProfileImage)

export default router