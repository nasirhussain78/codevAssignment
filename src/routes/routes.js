import express from 'express'
const router = express.Router();
import controller from '../controller/controller.js';
import authentication  from '../middleware/auth.js'


router.post('/register' , controller.createUser);
router.post('/login' , controller.loginUser);
router.post('/feed' ,authentication, controller.createFeed);
router.post('/comment' ,authentication, controller.createComment);
router.get('/allComments' ,authentication, controller.allComment);
router.delete('/deleteComment' ,authentication, controller.deleteComment);



export default router;