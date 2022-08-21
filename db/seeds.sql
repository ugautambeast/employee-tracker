INSERT INTO departments (name)
VALUES  ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Legal');


INSERT INTO roles (title, salary, department_id)
VALUES  ('Salesperson', 80000, 1),
        ('Lead Engineer', 150000, 2),
        ('Software Engineer', 120000, 2),
        ('Account Manager', 160000, 3),
        ('Accountant', 125000, 3),
        ('Legal Team Lead', 250000, 4),
        ('Lawyer', 190000, 4),
        ('Head of Sales', 115000, 1);


INSERT INTO employees (firstName, lastName, role_id, manager_id)
VALUES  ('Mike', 'Chan', 1, 2),
        ('John', 'Miller', 8, NULL ),
        ('Ashley', 'Rodriquez', 2, NULL),
        ('Kevin', 'Nguyen', 3, 3),
        ('Kunal', 'Singh', 4, NULL),
        ('Malia', 'Brown', 5, 5),
        ('Sarah', 'Lourd', 6, NULL),
        ('Tom', 'Allen', 7, 7);