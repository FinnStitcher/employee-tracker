// departments
const viewDept = `SELECT * FROM department`;

const addDept = `INSERT INTO department (name) VALUES (?)`;

// roles
const viewRole = `SELECT role.id, role.title, department.name AS department, salary
FROM role
JOIN department ON department.id = role.department_id`;

const addRole = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

// employees
const viewEmployee = `SELECT employee.id, employee.first_name, employee.last_name,
role.title, department.name AS department, role.salary
FROM employee
JOIN role ON role.id = employee.role_id
JOIN department ON department.id = role.department_id`;
// going to try adding managers with javascript on the outside, because the demo shows their full names in one column

const addEmployee = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`

const updateEmployeeRole = `UPDATE employee SET role_id = ? WHERE id = ?`;

// probably best to do data validation before the query goes to the database
// we'll do that later as part of inquirer

module.exports = {
    viewDept,
    addDept,
    viewRole,
    addRole,
    viewEmployee,
    addEmployee,
    updateEmployeeRole
};