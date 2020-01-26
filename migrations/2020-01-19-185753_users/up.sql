CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    userName VARCHAR NOT NULL UNIQUE,
    passwordHash VARCHAR NOT NULL,
    emailAddress VARCHAR
);

