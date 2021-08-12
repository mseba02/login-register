// imports
const express = require('express');
const router = express.Router();

const userController = require('../controllers/user-controller');

// user custom routes
router.get('/', userController.getUsers);
router.post('/email', userController.userExists);
router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.patch('/activate/:uid', userController.activateAccount);

// export
module.exports = router;