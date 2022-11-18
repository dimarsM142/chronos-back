const express = require('express');
const checkTokenMiddleware = require('../../middleware/auth');
const { getInfoCurrentUser,
        changeInfoCurrentUser,
        deleteAccountCurrentUser, 
        getUsersAvatarMe,
        patchUsersAvatarMe
    } = require('../../controllers/user-controller');

const router = express.Router();

router.get('/me', checkTokenMiddleware, getInfoCurrentUser);
router.get('/me/avatar', checkTokenMiddleware, getUsersAvatarMe);
router.patch('/me', checkTokenMiddleware, changeInfoCurrentUser);
router.patch('/me/avatar', checkTokenMiddleware, patchUsersAvatarMe);
router.delete('/me', checkTokenMiddleware, deleteAccountCurrentUser);

module.exports = router;
