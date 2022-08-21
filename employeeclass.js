const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('../db_config/connections.js');


// View all employees
const showEmployees = () => {
    const mysql = `SELECT employees.id,
                            employees.firstName,
                            employees.lastName,
                            roles.title AS role,
                            roles.salary,
                            departments.name AS department,
                            CONCAT (e.firstName, " ", e.lastName) AS manager
                    FROM employees
                            INNER JOIN roles ON roles.id = employees.role_id 
                            INNER JOIN departments ON departments.id = roles.department_id
                            LEFT JOIN employees e ON employees.manager_id = e.id`;

    connection.query(mysql, (err, result) => {
        console.table(('Showing all roles:\n'), result)
    });
}

// ADD an employee
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?"
        }
    ])
    .then(answer => {
        const newEmployee = [answer.firstName, answer.lastName];

        const roleSql = `SELECT title, id FROM roles`;

        connection.query(roleSql, (err, roleResult) => {
            const roleList = roleResult.map(({ title, id }) => ({ name: title, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'title',
                    message: "What is the employee's role?",
                    choices: roleList,
                }
            ])
            .then(roleChoice => {
                newEmployee.push(roleChoice.title);

                const managerSql = `SELECT * FROM employees`;

                connection.query(managerSql, (err, managerResults) => {
                    if (err) throw err;
                    const managers = managerResults.map(({ id, firstName, lastName }) => ({ name: firstName + ' ' + lastName, value: id }));
                    managers.unshift('0');
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is the employee's manager?",
                            choices: managers       
                        }
                    ])
                    .then(managerChoice => {
                        newEmployee.push(managerChoice.manager);

                        const mysql = `INSERT INTO employees (firstName, lastName, role_id, manager_id)
                                        VALUES (?, ?, ?, ?)`;
                        connection.query(mysql, newEmployee, (err, result) => {
                            if (err) {
                                throw err;
                            }
                            console.log('Successfully added ' + answer.firstName + ' ' + answer.lastName + ' to employees list!\n');

                            showEmployees();
                        });
                    });
                });
            });
        });
    });
};

// UPDATE an employee's role
const updateEmployRole = () => {
    const employSql = `SELECT * FROM employees`;
    connection.query(employSql, (err, result) => {
        if (err) throw err;

        const employeeList = result.map(({ id, firstName, lastName }) => ({ name: firstName + ' ' + lastName, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Which employee would you like to update?',
                choices: employeeList
            }
        ])
        .then(employChoice => {
            const selectedEmploy = employChoice.name;
            const updateEmploy = [];
            updateEmploy.push(selectedEmploy);

            const rolesSql = `SELECT * FROM roles`;

            connection.query(rolesSql, (err, rolesResult) => {
                if (err) throw err;

                const rolesList = rolesResult.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'title',
                        message: "What is the employee's new role?",
                        choices: rolesList
                    }
                ])
                .then(roleChoice => {
                    const newRole = roleChoice.title;
                    updateEmploy.push(newRole);

                    let employee = updateEmploy[0]
                    updateEmploy[0] = roleChoice.title
                    updateEmploy[1] = employee

                    const mysql = `UPDATE employees SET role_id = ? WHERE id = ?`;

                    connection.query(mysql, updateEmploy, (err, result) => { 
                        if (err) throw err;
                        console.log("Successfully updated employee's role!");

                        showEmployees();
                    });
                });
            });
        });
    });
};

// BONUS - UPDATE employee's manager
const updateEmployManager = () => {
    const employSql = `SELECT * FROM employees`;
    connection.query(employSql, (err, result) => {
        if (err) throw err;

        const employeeList = result.map(({ id, firstName, lastName }) => ({ name: firstName + ' ' + lastName, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Which employee would you like to update?',
                choices: employeeList
            }
        ])
        .then(employChoice => {
            const selectedEmploy = employChoice.name;
            const updateEmploy = [];
            updateEmploy.push(selectedEmploy);

            const managerSql = `SELECT * FROM employees`;

            connection.query(managerSql, (err, managerResult) => {
                if (err) throw err;

                const employList = managerResult.map(({ id, firstName, lastName }) => ({ name: firstName + ' ' + lastName, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Who is the employee's new manager?",
                        choices: employList
                    }
                ])
                .then(managerChoice => {
                    const newManager = managerChoice.manager;
                    updateEmploy.push(newManager);

                    let employee = updateEmploy[0]
                    updateEmploy[0] = managerChoice.manager
                    updateEmploy[1] = employee

                    const mysql = `UPDATE employees SET manager_id = ? WHERE id = ?`;

                    connection.query(mysql, updateEmploy, (err, result) => { 
                        if (err) throw err;
                        console.log("Successfully updated employee's manager!");

                        showEmployees();
                    });
                });
            });
        });
    });
};

// BONUS - DELETE employees
const deleteEmployee = () => {
    const mysql = `SELECT * FROM employees`;
    connection.query(mysql, (err, result) => {
        const employeelist = result.map(({ id, firstName, lastName }) => ({ name: firstName + ' ' + lastName, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: 'Which employee would you like to delete?', 
                choices: employeelist
            }
        ])
        .then(answer => {
            const deletedEmploy = answer.name;
            const deleteSql = `DELETE FROM employees WHERE id=?`;

            connection.query(deleteSql, deletedEmploy, (err, result) => {
                console.log('Successfully deleted ' + answer.name + ' from employee list!\n');

                showEmployees();
            });
        });
    });
};

module.exports = { showEmployees, addEmployee, updateEmployRole, updateEmployManager, deleteEmployee }