module.exports = {
    secret: "SECRET_KEY_MUKGER",
    tokens: {
        access: {
            type: 'access',
            expiresIn: '6h'
        },
        refresh: {
            type: 'refresh',
            expiresIn: '9h'
        }
    }
}
