const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');

const connection = mysql.createConnection({ 
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("You are now connected as id: " + connection.threadId + "/n");
    askQuestions();
});

function askQuestions() {
    inquirer.prompt({ 
      message: "What would you like to do?",
      type: "list",
      choices: [
        "View all employees",
        "View all departments",
        "Add an employee",
        "Add department",
        "Add role",
        "Update employee roles",
        "QUIT"
      ],
      name: "choices"
    }).then(answers => {
        console.log(answers.choices);
        switch (answers.choices) {
            case "View all employees":
                viewEmployees()
                break;
            case "View all departments":
                 viewDepartments()
                break;
            case "Add employee":
                addEmployee()
                break;
            case "Add department":
                addDepartment()
                break;
            case "Add role":
                addRole()
                break;
            case "Update employee roles":
                updateEmployeeRoles()
                break;
            default:
                connection.end()
                break;
        }
    
    })
}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, data) {
        console.table(data);
        askQuestions();
    })
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, data) {
        console.table(data);
        askQuestions();
    })
}

function addEmployee() {
    inquirer.prompt([{
        type: 'input',
        name: 'first_name',
        message: "Please add employees first name"
    },
    {
        type: 'input',
        name: 'last_name',
        message: "Please add employees last name"
    },
    {
        type: 'number',
        name: 'employee_id',
        message: "Please provide an employee ID"
    },
    {
        type: 'number',
        name: 'manager_id',
        message: "Please provide employees manager ID"
    }
]).then(function(res) {
    connection.query('INSERT INTO employee (first_name, last_name, employee_id, manager_id) VALUES (?, ?, ?, ?)', [res.first_name, res.last_name, res.employee_id, res.manager_id], function(err, data) {
        if (err) throw err;
        console.table("Successfully Saved!");
        askQuestions();
    })
})
}

function addDepartment() {
    inquirer.prompt([{
        type: "input",
        name: "name",
        message: "Please provide department name you would like to add?"
    }, ]).then(function(res) {
        connection.query('INSERT INTO department (name) VALUES (?)', [res.department], function(err, data) {
            if (err) throw err;
            console.table("Successfully Saved!");
            askQuestions;
        })
    })
}

function addRole() {
    inquirer.prompt([
        {
            message: "Enter title",
            type: "input",
            name:"title"
        }, {
            message: "Enter salary",
            type: "number",
            name:"salary"
        }, {
            message: "Enter department ID",
            type: "number",
            name:"department_id"
        }
    ]).then(function (response) {
        connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", [response.title, response.salary, response.department_id], function (err, data) {
            console.table(data);
        })
        askQuestions();
    })
}

function updateEmployeeRoles() {
    inquirer.prompt([
        {
            message: "Select employee you would like to update (use first name)",
            type: "input",
            name: "name"
        }, {
            message: "Enter new employee ID:",
            type: "number",
            name: "employee_id"
        }
    ]).then(function (response) {
        connection.query("UPDATE employee set employee_id = ? WHERE first_name = ?", [response.employee_id, response.name], function (err, data) {
            console.table(data);
        })
        askQuestions;
    })
}
