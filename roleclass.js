const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('../db_config/connections.js');


// VIEW all roles
const showRoles = () => {
    const mysql = `SELECT roles.id, roles.title, roles.salary, departments.name AS department 
                    FROM roles 
                    LEFT JOIN departments ON departments.id = roles.department_id`;
    connection.query(mysql, (err, result) => {
        console.table(('Showing all positions:\n'), result)
    });
}

// ADD a new role
const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the new role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?'
        }
    ])
    .then(answer => {
        const newRole = [answer.title, answer.salary];

        const roleSql = `SELECT * FROM departments`;
        connection.query(roleSql, (err, deptResult) => {
            const deptList = deptResult.map(({ name, id }) => ({ name: name, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'name',
                    message: 'Which department does this role pertain to?',
                    choices: deptList
                }
            ])
            .then(deptChoice => {
                newRole.push(deptChoice.name);
                const mysql = `INSERT INTO roles (title, salary, department_id)
                                    VALUES (?, ?, ?)`;
                connection.query(mysql, newRole, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    console.log('Sucessfully added ' + answer.title + ' to roles!\n');
                    showRoles();
                });
            });
        });
    });
};

// BONUS - DELETE roles
const deleteRole = () => {
    const mysql = `SELECT * FROM roles`;
    connection.query(mysql, (err, result) => {
        const rolesList = result.map(({ title, id }) => ({ name: title, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'title',
                message: 'Which position would you like to delete?',
                choices: rolesList
            }
        ])
            .then(answer => {
                const role = answer.title;
                const mysql = `DELETE FROM roles WHERE id= ?`;

                connection.query(mysql, role, (err, result) => {
                    console.log('Sucessfully deleted ' + answer.title + ' from roles!\n');

                    showRoles();
                });
            });
    });
}


module.exports = { showRoles, addRole, deleteRole }