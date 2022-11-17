const express = require('express');
const { register,
        login,
        logout,
        pswReset,
        confPswReset,
        refreshTokens } = require('../../controllers/authent-controller');

const router = express.Router();

router.post('/auth/register', register);                          //Зареєструватися
router.post('/auth/login', login);                                //Залогінитися
router.post('/auth/logout', logout);                              //Логаутнутись
router.post('/auth/password-reset', pswReset);                    //Скинути пароль
router.post('/auth/password-reset/:confirmToken', confPswReset);  //Ввести новий пароль
router.post('/refresh-tokens', refreshTokens);                    //Отримати нову пару токенів

module.exports = router;
