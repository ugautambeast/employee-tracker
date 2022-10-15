const inquirer = require("inquirer")
const mysql = require('mysql')

const connection = mysql.createConnection(
    host: "localhost",
    port: 3002,
    password: "password"
);

type: "list",
message: "what would you like to do?",
Choices: ["view all employees?"]
