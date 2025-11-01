import { Router } from 'express';
import * as userController from '../controllers/user.controllers.js';
import auth from '../middlewares/authMiddlewares.js';

const router = Router();

//public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

//protected routes
router.get('/profile', auth, userController.getUserProfile);
router.put('/profile', auth, userController.updateUserProfile);
router.get('/cart', auth, userController.getCartItems);
router.post('/cart', auth, userController.addToCart);
router.post('/profile/avatar-url', auth, userController.updateAvatarUrl);

router.get('/products', userController.getAllProducts);
router.get('/products/:id', userController.getProductById);

export default router;
