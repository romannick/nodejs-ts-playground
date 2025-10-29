CREATE DATABASE IF NOT EXISTS nodeJsPlayground;

CREATE USER IF NOT EXISTS 'nodeJsBackend'@'%' IDENTIFIED BY 'password';

GRANT ALL PRIVILEGES ON nodeJsPlayground.* TO 'nodeJsBackend'@'%';

FLUSH PRIVILEGES;
