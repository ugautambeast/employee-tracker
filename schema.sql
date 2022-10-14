drop database employee_db;

creating database employee_db;

use employee_db;

create table departments (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(1),
);

create table role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NULL,
    salary DECIMAL(10.3) NULL,
);

create table employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30) NULL,
    );