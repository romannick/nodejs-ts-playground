CREATE DATABASE IF NOT EXISTS nodeJsPlayground;

CREATE USER IF NOT EXISTS 'userService'@'%' IDENTIFIED BY 'password';
CREATE USER IF NOT EXISTS 'productService'@'%' IDENTIFIED BY 'password';

GRANT ALL PRIVILEGES ON nodeJsPlayground.* TO 'userService'@'%';
GRANT ALL PRIVILEGES ON nodeJsPlayground.* TO 'productService'@'%';

FLUSH PRIVILEGES;
