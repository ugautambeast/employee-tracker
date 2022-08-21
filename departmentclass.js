const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('../db_config/connections.js');


// VIEW all departments
const showDepartments = () => {
    connection.query(`SELECT * FROM departments;`, (err, result) => {
        console.table(('Showing all departments:\n'), result)
    });
};

// ADD a new department
const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the new department?'
        }
    ])
    .then(answer => {
        const mysql = `INSERT INTO departments (name)
                        VALUE (?)`;
        connection.query(mysql, answer.name, (err, result) => {
            console.log('Sucessfully added ' + answer.name + ' to departments:\n');

            showDepartments();
        });
    });
};

// BONUS - DELETE department
const deleteDepartment = () => {
    const mysql = `SELECT * FROM departments`;
    connection.query(mysql, (err, result) => {
        const deptsList = result.map(({name, id}) => ({name: name, value: id}));
    
        inquirer.prompt([
            {
                type: 'list',
                name: 'depts',
                message: 'Which department would you like to delete?',
                choices: deptsList
            }
        ])
        .then(answer => {
            const depts = answer.depts;
            const mysql = `DELETE FROM departments WHERE id= ?`;

            connection.query(mysql, depts, (err, result) => {
                console.log('Sucessfully deleted ' + answer.depts + ' from departments:\n');

                showDepartments();
            });
        });
    });
};

// BONUS - VIEW department's budget
const viewBudgets = () => {
    const mysql = `SELECT department_id AS id,
                        departments.name AS name,
                        SUM(salary) AS budget
                    FROM roles
                    JOIN departments ON roles.department_id = departments.id GROUP by department_id`;
    connection.query(mysql, (err, result) => {
        console.table(('Showing budgets for each department:\n'), result)
    })
}




module.exports = { showDepartments, addDepartment, deleteDepartment, viewBudgets }