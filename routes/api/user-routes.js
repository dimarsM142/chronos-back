const express = require('express');
const checkTokenMiddleware = require('../../middleware/auth');
const { getInfoCurrentUser,
        changeInfoCurrentUser,
        deleteAccountCurrentUser } = require('../../controllers/user-controller');

const router = express.Router();

router.get('/me', checkTokenMiddleware, getInfoCurrentUser);
router.patch('/me', checkTokenMiddleware, changeInfoCurrentUser);
router.delete('/me', checkTokenMiddleware, deleteAccountCurrentUser);

module.exports = router;
