USE heroku_58afbdcbb5cf3b1;

DROP TABLE IF EXISTS tokens;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users_calendars;

DROP TABLE IF EXISTS calendars;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id INT(8) UNSIGNED AUTO_INCREMENT NOT NULL,
    PRIMARY KEY (id),
    login VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS calendars (
    id INT(8) UNSIGNED AUTO_INCREMENT NOT NULL,
    PRIMARY KEY (id),
    user_id INT(8) UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS events (
    id INT(8) UNSIGNED AUTO_INCREMENT NOT NULL,
    PRIMARY KEY (id),
    calendar_id INT(8) UNSIGNED NOT NULL,
    FOREIGN KEY (calendar_id) REFERENCES calendars(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('arrangement', 'reminder', 'task') NOT NULL,
    execution_date DATETIME,
    duration INT(8) DEFAULT 1800,
    notification INT(1) DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS users_calendars (
    user_id INT(8) UNSIGNED NOT NULL,
    calendar_id INT(8) UNSIGNED NOT NULL,
    PRIMARY KEY (user_id, calendar_id),
    FOREIGN KEY (user_id)  REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (calendar_id) REFERENCES calendars(id) ON DELETE CASCADE,
    role ENUM('admin', 'user') NOT NULL
);

CREATE TABLE IF NOT EXISTS tokens (
    id VARCHAR(255),
    PRIMARY KEY (id),
    user_id INT(8) UNSIGNED NOT NULL,
    FOREIGN KEY (user_id)  REFERENCES users(id) ON DELETE CASCADE
);