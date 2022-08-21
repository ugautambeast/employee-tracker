const { showDepartments, addDepartment, deleteDepartment, viewBudgets } = require('./routes/departmentClass');
const { showEmployees, addEmployee, updateEmployRole, updateEmployManager, deleteEmployee } = require('./routes/employeeClass');
const { showRoles, addRole, deleteRole } = require('./routes/roleClass');

const connection = require('./db_config/connections.js');

const inquirer = require('inquirer');

const init = () => {mainMenu()}

const mainMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Update an employee manager',
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'View department budgets',
                'End application']
        }
    ]).then(answers => {
        let { choices } = answers;
        if (choices === 'View all departments') {
            showDepartments();
        }
        if (choices === 'View all roles') {
            showRoles();
        }
        if (choices === 'View all employees') {
            showEmployees();
        }
        if (choices === 'Add a department') {
            addDepartment();
        }
        if (choices === 'Add a role') {
            addRole();
        }
        if (choices === 'Add an employee') {
            addEmployee();
        }
        if (choices === 'Update an employee role') {
            updateEmployRole();
        }
        if (choices === 'Update an employee manager') {
            updateEmployManager();
        }
        if (choices === 'Delete a department') {
            deleteDepartment();
        }
        if (choices === 'Delete a role') {
            deleteRole();
        }
        if (choices === 'Delete an employee') {
            deleteEmployee();
        }
        if (choices === 'View department budgets') {
            viewBudgets();
        }
        if (choices === 'End application') {
            connection.end();
        }
    });
}


init();