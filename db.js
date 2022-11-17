const mysql = require('mysql');
const configPath = require.resolve('./config.json');
const readConfig = require('read-config');
const config = readConfig(configPath);

module.exports = mysql.createPool(config);
