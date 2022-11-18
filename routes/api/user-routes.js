const express = require('express');
const checkTokenMiddleware = require('../../middleware/auth');
const { getInfoCurrentUser,
        changeInfoCurrentUser,
        deleteAccountCurrentUser,
        uploadCurrentUserAvatar } = require('../../controllers/user-controller');

const router = express.Router();

router.get('/me', checkTokenMiddleware, getInfoCurrentUser);
router.patch('/me', checkTokenMiddleware, changeInfoCurrentUser);
router.delete('/me', checkTokenMiddleware, deleteAccountCurrentUser);
router.post('/me/uploadAvatar', checkTokenMiddleware, uploadCurrentUserAvatar);

module.exports = router;
