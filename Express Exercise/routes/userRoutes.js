const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.post('/generateOTP', userController.generateOTP);
router.get('/:user_id/verifyOTP', userController.verifyOTP);

module.exports = router;
