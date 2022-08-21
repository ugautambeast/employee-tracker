const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

function viewDepartments() { db.query({sql:'SELECT * FROM departments'}, (errors, results, fields) => {
        if(errors) {console.log(errors.message)};
        console.table(results);
        initialPrompt();
    });
    
};

function viewRoles() { db.query({sql:'SELECT * FROM roles'}, (errors, results, fields) => {
        if(errors) {console.log(errors.message)};
        console.table(results);
        initialPrompt();
    });

};

function viewEmployees() { db.query({sql:'SELECT * FROM employees'}, (errors, results, fields) => {
        if(errors) {console.log(errors.message)};
        console.table(results);
        initialPrompt();
    });

};

function addDepartment() {
    
        return inquirer.prompt(
            {
                type: 'input',
                name: 'departmentName',
                message: 'Input the name of the department to be added'
            }
        ).then(data => {
            const dpName = data.departmentName;
            const sql = `INSERT INTO departments (name)
                        VALUES
                        (?)`;
            db.query(sql, dpName, (errors, results) => {
                if(errors){console.log(errors.message)};
            
            console.table(results);
            console.log('==============================');
            console.log('Department added');
         });
         console.log('==============================');
         initialPrompt();
        });
        
    };

function addRole() {

    return inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Input the name of the role to be added'
        },
        {
            type: 'number',
            name: 'salary',
            message: 'Input the salary of the role to be added'
        },
        {
            type: 'number',
            name: 'department_id',
            message: 'Input the Department ID of the role to be added'
        }
    ]).then(data => {
        
        db.query({sql: `INSERT INTO roles (title, salary, department_id)
        VALUES
        ('${data.title}', ${data.salary}, ${data.department_id});`}, (errors, results) => {
            if(errors){
                console.log(errors.message);
                return;
            };
        
        console.table(results);
        console.log('==============================');
        console.log('Role added');
     });
     
     console.log('==============================');
     initialPrompt();
    }).catch((err) => {
        if(err) {
            console.log(err.message);
        }
     });

}

function addEmployee() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Input the first name of the Employee to be added'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Input the last name of the Employee to be added'
        },
        {
            type: 'number',
            name: 'roles_id',
            message: 'Input the role ID of the Employee to be added'
        },
        {
            type: 'number',
            name: 'manager_id',
            message: 'Input the manager ID of the Employee to be added'
        },
    ])
    .then(data => {
        db.query({sql: `INSERT INTO employees (first_name, last_name, roles_id, manager_id)
        VALUES
            ('${data.first_name}', '${data.last_name}', ${data.roles_id}, ${data.manager_id});`}, (errors, results) => {
                if(errors) {
                    console.log(errors.message);
                    return;
                }

                console.table(results);
                console.log('==============================');
                console.log('Employee added');
             });
             
             console.log('==============================');
             initialPrompt();
            }).catch((err) => {
                if(err) {
                    console.log(err.message);
                }
             });
}
   
function updateRole() {
    
    return inquirer.prompt([
        {
            type: 'number',
            name: 'employeeId',
            message: 'What is the ID of the employee whose role you would like to change?'
        },
        {
            type: 'input',
            name: 'newRole',
            message: 'Please input the new Role ID to change the Employee role'
        },
        {
            type: 'number',
            name: 'manager_id',
            message: 'Input the manager ID of the Employee to be updated'
        },
    ]).then(data => {
            db.query({sql:`UPDATE employees
            SET roles_id = ${data.newRole}, manager_id = ${data.manager_id}
            WHERE id = ${data.employeeId}`}, (err, results) => {
                if(err) {
                    console.log(err.message)
                    return;
                }
                console.log('==============================');
                console.table(results);
                console.log('Role added');
                initialPrompt();
            })
            
        })
}

function initialPrompt() {
    return inquirer.prompt([
        {
        type: 'list',
        name: 'initialPrompt',
        message: 'What would you like to do?',
        choices: ['View Departments', 'View Roles', 'View Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role'],
        }
    ]).then(data => {
        console.log('==============================');
       switch(data.initialPrompt) {
           case 'View Departments':
            viewDepartments();
            break;
           case 'View Roles':
            viewRoles();
            break;
           case 'View Employees':
            viewEmployees();
            break;     
           case 'Add Department':
            addDepartment();
            break;
           case 'Add Role':
            addRole();
            break;
           case 'Add Employee':
            addEmployee();
            break;
           case 'Update Employee Role':
            updateRole();
            break;    
       }
   
        
    });    
};

initialPrompt();

// module.exports = initialPrompt;