const express = require('express');
const userController = require('../controllers/user.controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('/sign-up', userController.signUp);
router.patch('/update', checkAuth.checkAuth, userController.updateUser);
router.delete('/', checkAuth.checkAuth, userController.deleteUser);

module.exports = router;