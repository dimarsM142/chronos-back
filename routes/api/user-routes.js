const express = require('express');
const checkTokenMiddleware = require('../../middleware/auth');
const { getInfoCurrentUser,
        changeInfoCurrentUser,
        deleteAccountCurrentUser, 
        getUsersAvatarMe,
        patchUsersAvatarMe
    } = require('../../controllers/user-controller');

const router = express.Router();

router.get('/user/:login', checkTokenMiddleware, getInfoCurrentUser);
router.get('/me', checkTokenMiddleware, getUsersAvatarMe);
router.patch('/me', checkTokenMiddleware, changeInfoCurrentUser);
router.patch('/me', checkTokenMiddleware, patchUsersAvatarMe);
router.delete('/me', checkTokenMiddleware, deleteAccountCurrentUser);

module.exports = router;
